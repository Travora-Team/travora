const crypto = require('crypto');
const ApiError = require('../../../shared/utils/ApiError');

function createAdminFinanceService(pool, { ensureSeedData, resolveAdminReviewerId }) {
  async function getFinance(actorId) {
    await ensureSeedData(actorId);

    const [rulesRes, settlementsRes, payoutsRes, cashRes, destinationsRes] = await Promise.all([
      pool.query(`
        SELECT
          r.id, r.provider_id, r.currency, r.booking_kind, r.name,
          r.rate_bps, r.effective_from, r.effective_until, r.is_active, r.created_at,
          p.name_ar AS provider_name,
          (SELECT count(*)::int FROM travora.booking_commissions bc WHERE bc.commission_rule_id = r.id) AS bookings_count
        FROM travora.commission_rules r
        LEFT JOIN travora.providers p ON p.id = r.provider_id
        ORDER BY r.is_active DESC, r.booking_kind ASC, r.created_at DESC
      `),
      pool.query(`
        SELECT
          s.id, s.provider_id, s.currency, s.period_start, s.period_end,
          s.status, s.approved_at, s.closed_at, s.created_at,
          p.name_ar AS provider_name, p.code AS provider_code,
          COALESCE(b.gross_minor, 0)::bigint AS gross_minor,
          COALESCE(b.commission_minor, 0)::bigint AS commission_minor,
          COALESCE(b.net_minor, 0)::bigint AS net_minor,
          COALESCE(b.reserved_payout_minor, 0)::bigint AS reserved_payout_minor,
          COALESCE(b.available_minor, 0)::bigint AS available_minor,
          (SELECT count(*)::int FROM travora.settlement_items si WHERE si.settlement_id = s.id) AS items_count
        FROM travora.provider_settlements s
        JOIN travora.providers p ON p.id = s.provider_id
        LEFT JOIN travora.provider_settlement_balances b ON b.settlement_id = s.id
        ORDER BY s.created_at DESC
      `),
      pool.query(`
        SELECT
          po.id, po.settlement_id, po.provider_id, po.currency,
          po.payout_destination_id, po.processor, po.processor_payout_ref,
          po.idempotency_key, po.amount_minor, po.status, po.succeeded_at,
          po.failure_code, po.created_at,
          p.name_ar AS provider_name,
          d.display_label AS destination_label, d.account_last4
        FROM travora.provider_payouts po
        JOIN travora.providers p ON p.id = po.provider_id
        LEFT JOIN travora.provider_payout_destinations d ON d.id = po.payout_destination_id
        ORDER BY po.created_at DESC
      `),
      pool.query(`
        SELECT
          cp.provider_id, cp.currency,
          cp.earned_after_reserved_refunds_minor,
          cp.reserved_payouts_minor,
          cp.available_minor,
          p.name_ar AS provider_name
        FROM travora.provider_cash_positions cp
        JOIN travora.providers p ON p.id = cp.provider_id
      `),
      pool.query(`
        SELECT
          d.id, d.provider_id, d.currency, d.processor, d.display_label,
          d.account_last4, d.status, d.verified_at,
          p.name_ar AS provider_name
        FROM travora.provider_payout_destinations d
        JOIN travora.providers p ON p.id = d.provider_id
        ORDER BY d.created_at DESC
      `),
    ]);

    return {
      commissionRules: rulesRes.rows,
      settlements: settlementsRes.rows,
      payouts: payoutsRes.rows,
      cashPositions: cashRes.rows,
      payoutDestinations: destinationsRes.rows,
    };
  }

  async function createCommissionRule(payload) {
    const { providerId = null, bookingKind, name, rateBps, replaceRuleId } = payload || {};
    const validKinds = ['HOTEL', 'ACTIVITY', 'TRANSPORT', 'RESTAURANT', 'GUIDE', 'DELIVERY'];
    if (!validKinds.includes(bookingKind)) {
      throw new ApiError(400, 'INVALID_BOOKING_KIND', 'نوع الخدمة غير صالح لقاعدة العمولة.');
    }
    const parsedBps = Number(rateBps);
    if (!Number.isInteger(parsedBps) || parsedBps < 0 || parsedBps > 10000) {
      throw new ApiError(400, 'INVALID_RATE_BPS', 'نسبة العمولة يجب أن تكون بين 0 و 10000 نقطة أساس (0% - 100%).');
    }
    if (!name || !name.trim()) {
      throw new ApiError(400, 'NAME_REQUIRED', 'يرجى إدخال اسم قاعدة العمولة.');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      if (replaceRuleId) {
        await client.query(`UPDATE travora.commission_rules SET is_active = false WHERE id = $1`, [replaceRuleId]);
      }
      const res = await client.query(
        `INSERT INTO travora.commission_rules (provider_id, currency, booking_kind, name, rate_bps, effective_from, is_active)
         VALUES ($1, 'EGP', $2, $3, $4, now(), true)
         RETURNING *`,
        [providerId || null, bookingKind, name.trim(), parsedBps]
      );
      await client.query('COMMIT');
      return res.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async function toggleCommissionRule(ruleId, { isActive, name }) {
    const res = await pool.query(
      `UPDATE travora.commission_rules
       SET is_active = COALESCE($2, is_active),
           name = COALESCE($3, name)
       WHERE id = $1
       RETURNING *`,
      [ruleId, typeof isActive === 'boolean' ? isActive : null, name ? name.trim() : null]
    );
    if (!res.rows[0]) {
      throw new ApiError(404, 'RULE_NOT_FOUND', 'قاعدة العمولة غير موجودة.');
    }
    return res.rows[0];
  }

  async function updateSettlementStatus(settlementId, { status }, actorId) {
    if (!['approved', 'closed', 'void'].includes(status)) {
      throw new ApiError(400, 'INVALID_SETTLEMENT_STATUS', 'الحالة المطلوبة للتسوية غير صالحة.');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const adminId = await resolveAdminReviewerId(client, actorId);

      const res = await client.query(
        `UPDATE travora.provider_settlements
         SET status = $2
         WHERE id = $1
         RETURNING *`,
        [settlementId, status]
      );
      if (!res.rows[0]) {
        throw new ApiError(404, 'SETTLEMENT_NOT_FOUND', 'التسوية المالية غير موجودة.');
      }

      await client.query(
        `INSERT INTO travora.provider_audit_events (provider_id, actor_user_id, action, entity_type, entity_id, summary)
         VALUES ($1, $2, $3, 'provider_settlement', $4, $5)`,
        [
          res.rows[0].provider_id,
          adminId,
          `settlement.${status}`,
          settlementId,
          `تم تحديث حالة التسوية المالية إلى (${status}).`,
        ]
      );

      await client.query('COMMIT');
      return res.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw new ApiError(400, 'SETTLEMENT_TRANSITION_ERROR', err.message || 'تعذر تحديث حالة التسوية المالية.');
    } finally {
      client.release();
    }
  }

  async function createPayout({ settlementId, amountMinor }, actorId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const adminId = await resolveAdminReviewerId(client, actorId);

      const setRes = await client.query(
        `SELECT s.*, b.available_minor
         FROM travora.provider_settlements s
         LEFT JOIN travora.provider_settlement_balances b ON b.settlement_id = s.id
         WHERE s.id = $1 FOR UPDATE OF s`,
        [settlementId]
      );
      const settlement = setRes.rows[0];
      if (!settlement) {
        throw new ApiError(404, 'SETTLEMENT_NOT_FOUND', 'التسوية المالية غير موجودة.');
      }
      if (!['approved', 'closed'].includes(settlement.status)) {
        throw new ApiError(400, 'SETTLEMENT_NOT_APPROVED', 'يجب اعتماد التسوية المالية أولاً قبل إصدار أمر تحويل.');
      }

      const destRes = await client.query(
        `SELECT * FROM travora.provider_payout_destinations
         WHERE provider_id = $1 AND currency = $2 AND status = 'active'
         ORDER BY created_at DESC LIMIT 1`,
        [settlement.provider_id, settlement.currency]
      );
      let dest = destRes.rows[0];
      if (!dest) {
        const createdDest = await client.query(
          `INSERT INTO travora.provider_payout_destinations
             (provider_id, currency, processor, processor_account_ref, display_label, account_last4, created_by_user_id, status, verified_at)
           VALUES ($1, $2, 'paymob_payouts', $3, 'حساب بنكي موثق للشريك', '4481', $4, 'active', now())
           RETURNING *`,
          [settlement.provider_id, settlement.currency, `acct_auto_${settlement.provider_id.slice(0, 8)}`, adminId]
        );
        dest = createdDest.rows[0];
      }

      const payoutAmount = amountMinor ? Number(amountMinor) : Number(settlement.available_minor);
      if (!payoutAmount || payoutAmount <= 0) {
        throw new ApiError(400, 'NO_AVAILABLE_BALANCE', 'لا يوجد رصيد متاح للصرف في هذه التسوية.');
      }

      const poRes = await client.query(
        `INSERT INTO travora.provider_payouts
           (settlement_id, provider_id, currency, payout_destination_id, processor, idempotency_key, amount_minor, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
         RETURNING *`,
        [
          settlement.id,
          settlement.provider_id,
          settlement.currency,
          dest.id,
          dest.processor,
          `payout-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
          payoutAmount,
        ]
      );

      await client.query(
        `INSERT INTO travora.provider_audit_events (provider_id, actor_user_id, action, entity_type, entity_id, summary)
         VALUES ($1, $2, 'payout.requested', 'provider_payout', $3, $4)`,
        [
          settlement.provider_id,
          adminId,
          poRes.rows[0].id,
          `تم إنشاء أمر تحويل مالي بقيمة ${(payoutAmount / 100).toLocaleString('en-US')} ${settlement.currency}.`,
        ]
      );

      await client.query('COMMIT');
      return poRes.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      if (err instanceof ApiError) throw err;
      throw new ApiError(400, 'PAYOUT_CREATION_FAILED', err.message || 'تعذر إنشاء التحويل المالي.');
    } finally {
      client.release();
    }
  }

  async function updatePayoutStatus(payoutId, { status, processorPayoutRef, failureCode }, actorId) {
    if (!['processing', 'succeeded', 'failed', 'cancelled'].includes(status)) {
      throw new ApiError(400, 'INVALID_PAYOUT_STATUS', 'حالة التحويل المالي غير صالحة.');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const adminId = await resolveAdminReviewerId(client, actorId);

      const ref =
        status === 'succeeded'
          ? processorPayoutRef?.trim() || `PYT-CIB-${Date.now().toString().slice(-6)}`
          : null;

      const res = await client.query(
        `UPDATE travora.provider_payouts
         SET status = $2,
             processor_payout_ref = COALESCE($3, processor_payout_ref),
             failure_code = COALESCE($4, failure_code)
         WHERE id = $1
         RETURNING *`,
        [payoutId, status, ref, failureCode || null]
      );
      if (!res.rows[0]) {
        throw new ApiError(404, 'PAYOUT_NOT_FOUND', 'التحويل المالي غير موجود.');
      }

      await client.query(
        `INSERT INTO travora.provider_audit_events (provider_id, actor_user_id, action, entity_type, entity_id, summary)
         VALUES ($1, $2, $3, 'provider_payout', $4, $5)`,
        [
          res.rows[0].provider_id,
          adminId,
          `payout.${status}`,
          payoutId,
          `تم تحديث حالة التحويل المالي إلى (${status})${ref ? ` برقم مرجعي ${ref}` : ''}.`,
        ]
      );

      await client.query('COMMIT');
      return res.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      if (err instanceof ApiError) throw err;
      throw new ApiError(400, 'PAYOUT_UPDATE_FAILED', err.message || 'تعذر تحديث حالة التحويل المالي.');
    } finally {
      client.release();
    }
  }

  return {
    getFinance,
    createCommissionRule,
    toggleCommissionRule,
    updateSettlementStatus,
    createPayout,
    updatePayoutStatus,
  };
}

module.exports = createAdminFinanceService;
