const crypto = require('crypto');
const ApiError = require('../../../shared/utils/ApiError');
const { slugify } = require('../../../shared/utils/slugify');

function createAdminOperationsService(pool, { ensureSeedData, resolveAdminReviewerId }) {
  async function getProviders({ status, kind, search } = {}) {
    await ensureSeedData();
    const params = [];
    const conditions = [];

    if (status && status !== 'all') {
      params.push(status);
      conditions.push(`p.status = $${params.length}`);
    }
    if (kind && kind !== 'all') {
      params.push(kind);
      conditions.push(`p.organization_kind = $${params.length}`);
    }
    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      conditions.push(`(p.name_ar ILIKE $${params.length} OR p.name_en ILIKE $${params.length} OR p.legal_name ILIKE $${params.length} OR p.code ILIKE $${params.length})`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const res = await pool.query(
      `SELECT
         p.id, p.code,
         p.name_ar AS public_name_ar, p.name_en AS public_name_en,
         p.legal_name, p.organization_kind, p.country_code,
         p.contact_email AS support_email, p.phone_e164 AS support_phone,
         p.status, p.created_at,
         u.display_name AS owner_name, u.email AS owner_email,
         COALESCE(array_agg(DISTINCT pca.category_code) FILTER (WHERE pca.category_code IS NOT NULL), '{}') AS categories,
         (SELECT count(*)::int FROM travora.bookings b WHERE b.provider_id = p.id) AS bookings_count,
         (SELECT a.status FROM travora.provider_applications a WHERE a.provider_id = p.id ORDER BY a.created_at DESC LIMIT 1) AS latest_application_status
       FROM travora.providers p
       LEFT JOIN travora.users u ON u.id = p.owner_user_id
       LEFT JOIN travora.provider_category_assignments pca ON pca.provider_id = p.id
       ${whereClause}
       GROUP BY p.id, u.display_name, u.email
       ORDER BY p.created_at DESC`,
      params
    );
    return res.rows;
  }

  async function createProvider(payload, actorId) {
    const {
      publicNameAr,
      publicNameEn,
      legalName,
      organizationKind = 'business',
      category = 'hotel',
      supportEmail,
      supportPhone,
    } = payload || {};

    if (!publicNameAr || !publicNameEn) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'يرجى إدخال اسم مقدم الخدمة بالعربية والإنجليزية.');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const adminId = await resolveAdminReviewerId(client, actorId);
      const code = `${slugify(publicNameEn)}-${crypto.randomBytes(2).toString('hex')}`;
      const normalizedEmail = (supportEmail || 'partner@travora.eg').trim().toLowerCase();
      const normalizedPhone =
        supportPhone && /^\+[1-9][0-9]{7,14}$/.test(supportPhone.trim())
          ? supportPhone.trim()
          : '+201000000000';

      const pr = await client.query(
        `INSERT INTO travora.providers
           (code, owner_user_id, name_ar, name_en, legal_name, organization_kind, country_code, contact_email, phone_e164, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'EG', $7, $8, 'pending')
         RETURNING *, name_ar AS public_name_ar, name_en AS public_name_en`,
        [
          code,
          adminId,
          publicNameAr.trim(),
          publicNameEn.trim(),
          (legalName || publicNameAr).trim(),
          organizationKind,
          normalizedEmail,
          normalizedPhone,
        ]
      );
      const provider = pr.rows[0];

      await client.query(
        `INSERT INTO travora.provider_category_assignments (provider_id, category_code)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [provider.id, category]
      );

      await client.query(
        `INSERT INTO travora.provider_applications
           (provider_id, applicant_user_id, legal_name, country_code, registration_reference, status, submitted_at)
         VALUES ($1, $2, $3, 'EG', $4, 'submitted', now())`,
        [
          provider.id,
          adminId,
          (legalName || publicNameAr).trim(),
          `CR-EG-${Math.floor(100000 + Math.random() * 899999)}`,
        ]
      );

      await client.query(
        `INSERT INTO travora.provider_audit_events (provider_id, actor_user_id, action, entity_type, entity_id, summary)
         VALUES ($1, $2, 'provider.created', 'provider', $1, $3)`,
        [provider.id, adminId, `تم إنشاء ملف شريك خدمة جديد (${publicNameAr.trim()}) وإرسال طلب المراجعة.`]
      );

      await client.query('COMMIT');
      return provider;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async function updateProviderStatus(providerId, payload, actorId) {
    const { status, publicNameAr, legalName, supportEmail, supportPhone } = payload || {};
    const validStatuses = ['pending', 'active', 'suspended', 'archived'];
    if (status && !validStatuses.includes(status)) {
      throw new ApiError(400, 'INVALID_STATUS', 'حالة مقدم الخدمة غير صالحة.');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const adminId = await resolveAdminReviewerId(client, actorId);

      const res = await client.query(
        `UPDATE travora.providers
         SET status = COALESCE($2, status),
             name_ar = COALESCE($3, name_ar),
             legal_name = COALESCE($4, legal_name),
             contact_email = COALESCE($5, contact_email),
             phone_e164 = COALESCE($6, phone_e164)
         WHERE id = $1
         RETURNING *, name_ar AS public_name_ar, name_en AS public_name_en`,
        [
          providerId,
          status || null,
          publicNameAr || null,
          legalName || null,
          supportEmail ? supportEmail.trim().toLowerCase() : null,
          supportPhone || null,
        ]
      );

      if (!res.rows[0]) {
        throw new ApiError(404, 'PROVIDER_NOT_FOUND', 'مقدم الخدمة غير موجود.');
      }

      await client.query(
        `INSERT INTO travora.provider_audit_events (provider_id, actor_user_id, action, entity_type, entity_id, summary)
         VALUES ($1, $2, $3, 'provider', $1, $4)`,
        [
          providerId,
          adminId,
          `provider.status.${res.rows[0].status}`,
          `تم تحديث حالة الشريك (${res.rows[0].name_ar}) إلى (${res.rows[0].status}).`,
        ]
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

  async function getApplications({ status, search } = {}) {
    await ensureSeedData();
    const params = [];
    const conditions = [];

    if (status && status !== 'all') {
      params.push(status);
      conditions.push(`a.status = $${params.length}`);
    }
    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      conditions.push(`(a.legal_name ILIKE $${params.length} OR p.name_ar ILIKE $${params.length} OR p.contact_email ILIKE $${params.length})`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const res = await pool.query(
      `SELECT
         a.id, a.provider_id, a.applicant_user_id, p.organization_kind,
         COALESCE(array_agg(DISTINCT pca.category_code) FILTER (WHERE pca.category_code IS NOT NULL), '{}') AS requested_categories,
         a.legal_name, p.name_ar AS trade_name, a.country_code,
         a.registration_reference,
         a.partner_type, a.transport_subtype, a.city_slug, a.details_json,
         p.contact_email, p.phone_e164 AS contact_phone,
         a.status, a.submitted_at,
         a.reviewed_by_user_id, a.reviewed_at, a.decision_notes, a.created_at,
         p.code AS provider_code, p.name_ar AS public_name_ar, p.name_en AS public_name_en, p.status AS provider_status,
         u.display_name AS applicant_name,
         rev.display_name AS reviewer_name
       FROM travora.provider_applications a
       JOIN travora.providers p ON p.id = a.provider_id
       LEFT JOIN travora.provider_category_assignments pca ON pca.provider_id = p.id
       LEFT JOIN travora.users u ON u.id = a.applicant_user_id
       LEFT JOIN travora.users rev ON rev.id = a.reviewed_by_user_id
       ${whereClause}
       GROUP BY a.id, p.id, u.display_name, rev.display_name
       ORDER BY
         CASE a.status WHEN 'submitted' THEN 1 WHEN 'in_review' THEN 2 WHEN 'approved' THEN 3 ELSE 4 END,
         a.created_at DESC`,
      params
    );
    return res.rows;
  }

  async function reviewApplication(applicationId, { status, decisionNotes }, actorId) {
    if (!['approved', 'rejected', 'in_review'].includes(status)) {
      throw new ApiError(400, 'INVALID_DECISION', 'قرار المراجعة يجب أن يكون approved أو rejected أو in_review.');
    }
    if (status === 'rejected' && (!decisionNotes || !decisionNotes.trim())) {
      throw new ApiError(400, 'NOTES_REQUIRED', 'يرجى كتابة سبب الرفض أو الملاحظات المطلوبة من الشريك.');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const adminId = await resolveAdminReviewerId(client, actorId);

      const currentRes = await client.query(
        `SELECT * FROM travora.provider_applications WHERE id = $1 FOR UPDATE`,
        [applicationId]
      );
      const app = currentRes.rows[0];
      if (!app) {
        throw new ApiError(404, 'APPLICATION_NOT_FOUND', 'طلب الانضمام غير موجود.');
      }

      if (['approved', 'rejected', 'withdrawn'].includes(app.status)) {
        throw new ApiError(409, 'APPLICATION_ALREADY_DECIDED', 'تم البت في هذا الطلب مسبقاً ولا يمكن تعديل قراره النهائي.');
      }

      const isTerminal = status === 'approved' || status === 'rejected';
      const notes =
        decisionNotes?.trim() ||
        (status === 'approved'
          ? 'تم استيفاء جميع المستندات والتراخيص السياحية واعتماد الشريك.'
          : 'يرجى استكمال المستندات المطلوبة.');

      const updatedRes = await client.query(
        `UPDATE travora.provider_applications
         SET status = $2,
             reviewed_by_user_id = $3,
             reviewed_at = CASE WHEN $4 THEN now() ELSE reviewed_at END,
             decision_notes = $5
         WHERE id = $1
         RETURNING *`,
        [applicationId, status, isTerminal ? adminId : null, isTerminal, notes]
      );

      if (status === 'approved') {
        await client.query(`UPDATE travora.providers SET status = 'active' WHERE id = $1`, [app.provider_id]);
        await client.query(`UPDATE travora.hotels SET status = 'active' WHERE provider_id = $1 AND status = 'draft'`, [app.provider_id]);
        await client.query(`UPDATE travora.restaurants SET status = 'active' WHERE provider_id = $1 AND status = 'draft'`, [app.provider_id]);
        await client.query(`UPDATE travora.guide_profiles SET status = 'active' WHERE provider_id = $1 AND status = 'draft'`, [app.provider_id]);
        await client.query(`UPDATE travora.transport_services SET status = 'active' WHERE provider_id = $1 AND status = 'draft'`, [app.provider_id]);
      } else if (status === 'rejected') {
        await client.query(`UPDATE travora.providers SET status = 'suspended' WHERE id = $1`, [app.provider_id]);
        await client.query(`UPDATE travora.hotels SET status = 'archived' WHERE provider_id = $1 AND status = 'draft'`, [app.provider_id]);
        await client.query(`UPDATE travora.restaurants SET status = 'archived' WHERE provider_id = $1 AND status = 'draft'`, [app.provider_id]);
        await client.query(`UPDATE travora.guide_profiles SET status = 'archived' WHERE provider_id = $1 AND status = 'draft'`, [app.provider_id]);
        await client.query(`UPDATE travora.transport_services SET status = 'archived' WHERE provider_id = $1 AND status = 'draft'`, [app.provider_id]);
      }

      await client.query(
        `INSERT INTO travora.provider_audit_events (provider_id, actor_user_id, action, entity_type, entity_id, summary)
         VALUES ($1, $2, $3, 'provider_application', $4, $5)`,
        [
          app.provider_id,
          adminId,
          `application.${status}`,
          applicationId,
          `مراجعة طلب انضمام (${app.legal_name}): ${status === 'approved' ? 'تمت الموافقة والتفعيل' : status === 'rejected' ? 'تم الرفض' : 'طلب استكمال بيانات'} — ${notes}`,
        ]
      );

      await client.query('COMMIT');
      return updatedRes.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async function getUsers({ role, status, search } = {}) {
    await ensureSeedData();
    const params = [];
    const conditions = ['u.deleted_at IS NULL'];

    if (role && role !== 'all') {
      params.push(role);
      conditions.push(`u.role = $${params.length}`);
    }
    if (status && status !== 'all') {
      params.push(status);
      conditions.push(`u.status = $${params.length}`);
    }
    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      conditions.push(`(u.display_name ILIKE $${params.length} OR u.email ILIKE $${params.length} OR u.phone_e164 ILIKE $${params.length})`);
    }

    const res = await pool.query(
      `SELECT
         u.id, u.email, u.email_verified_at, u.phone_e164, u.phone_verified_at,
         u.display_name, u.country_code, u.role, u.status,
         u.created_at, u.updated_at,
         (SELECT count(*)::int FROM travora.bookings b WHERE b.user_id = u.id) AS bookings_count,
         (SELECT count(*)::int FROM travora.providers p WHERE p.owner_user_id = u.id) AS owned_providers_count
       FROM travora.users u
       WHERE ${conditions.join(' AND ')}
       ORDER BY
         CASE u.role WHEN 'admin' THEN 1 WHEN 'provider' THEN 2 ELSE 3 END,
         u.created_at DESC`,
      params
    );
    return res.rows;
  }

  async function updateUser(userId, payload) {
    const { role, status, displayName } = payload || {};
    if (role && !['traveler', 'provider', 'admin'].includes(role)) {
      throw new ApiError(400, 'INVALID_ROLE', 'الدور الوظيفي غير صالح.');
    }
    if (status && !['active', 'suspended'].includes(status)) {
      throw new ApiError(400, 'INVALID_STATUS', 'حالة الحساب غير صالحة.');
    }

    const res = await pool.query(
      `UPDATE travora.users
       SET role = COALESCE($2, role),
           status = COALESCE($3, status),
           display_name = COALESCE($4, display_name)
       WHERE id = $1
       RETURNING id, email, display_name, role, status, email_verified_at, phone_e164, phone_verified_at, created_at`,
      [userId, role || null, status || null, displayName ? displayName.trim() : null]
    );
    if (!res.rows[0]) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'المستخدم غير موجود.');
    }
    return res.rows[0];
  }

  async function getBookings({ kind, status, search } = {}) {
    await ensureSeedData();
    const params = [];
    const conditions = [];

    if (kind && kind !== 'all') {
      params.push(kind);
      conditions.push(`b.kind = $${params.length}`);
    }
    if (status && status !== 'all') {
      params.push(status);
      conditions.push(`b.status = $${params.length}`);
    }
    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      conditions.push(`(b.reference ILIKE $${params.length} OR b.service_title_snapshot ILIKE $${params.length} OR b.contact_name ILIKE $${params.length} OR b.contact_email ILIKE $${params.length})`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const res = await pool.query(
      `SELECT
         b.id, b.reference, b.user_id, b.kind, b.status, b.payment_terms, b.currency,
         b.subtotal_minor, b.tax_minor, b.fee_minor, b.discount_minor, b.total_minor,
         b.service_title_snapshot, b.contact_name, b.contact_email, b.contact_phone,
         b.hold_expires_at, b.confirmed_at, b.cancelled_at, b.created_at,
         p.name_ar AS provider_name, p.code AS provider_code,
         bc.rate_bps AS commission_rate_bps,
         (SELECT pa.status FROM travora.payment_attempts pa WHERE pa.booking_id = b.id ORDER BY pa.created_at DESC LIMIT 1) AS payment_status
       FROM travora.bookings b
       LEFT JOIN travora.providers p ON p.id = b.provider_id
       LEFT JOIN travora.booking_commissions bc ON bc.booking_id = b.id
       ${whereClause}
       ORDER BY b.created_at DESC`,
      params
    );
    return res.rows;
  }

  async function getDisputes({ status, priority, category, search } = {}) {
    await ensureSeedData();
    const params = [];
    const conditions = [];

    if (status && status !== 'all') {
      params.push(status);
      conditions.push(`t.status = $${params.length}`);
    }
    if (priority && priority !== 'all') {
      params.push(priority);
      conditions.push(`t.priority = $${params.length}`);
    }
    if (category && category !== 'all') {
      params.push(category);
      conditions.push(`t.category = $${params.length}`);
    }
    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      conditions.push(`(t.subject ILIKE $${params.length} OR u.display_name ILIKE $${params.length} OR b.reference ILIKE $${params.length})`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const ticketsRes = await pool.query(
      `SELECT
         t.id, t.user_id, t.booking_id, t.assigned_to_user_id,
         t.subject, t.category, t.status, t.priority,
         t.resolved_at, t.closed_at, t.created_at, t.updated_at,
         u.display_name AS customer_name, u.email AS customer_email,
         assignee.display_name AS assignee_name,
         b.reference AS booking_reference, b.service_title_snapshot, b.total_minor AS booking_total_minor, b.currency AS booking_currency,
         (
           SELECT json_agg(
             json_build_object(
               'id', m.id,
               'sender_role', m.sender_role,
               'body', m.body,
               'created_at', m.created_at,
               'author_name', au.display_name
             ) ORDER BY m.created_at ASC
           )
           FROM travora.support_messages m
           LEFT JOIN travora.users au ON au.id = m.author_user_id
           WHERE m.ticket_id = t.id
         ) AS messages
       FROM travora.support_tickets t
       JOIN travora.users u ON u.id = t.user_id
       LEFT JOIN travora.users assignee ON assignee.id = t.assigned_to_user_id
       LEFT JOIN travora.bookings b ON b.id = t.booking_id
       ${whereClause}
       ORDER BY
         CASE WHEN t.status IN ('OPEN', 'WAITING_AGENT') THEN 0 ELSE 1 END,
         CASE t.priority WHEN 'URGENT' THEN 1 WHEN 'HIGH' THEN 2 WHEN 'NORMAL' THEN 3 ELSE 4 END,
         t.created_at DESC`,
      params
    );

    return ticketsRes.rows;
  }

  async function updateDispute(ticketId, { status, priority, replyMessage }, actorId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const adminId = await resolveAdminReviewerId(client, actorId);

      const curRes = await client.query(`SELECT * FROM travora.support_tickets WHERE id = $1 FOR UPDATE`, [ticketId]);
      const ticket = curRes.rows[0];
      if (!ticket) {
        throw new ApiError(404, 'TICKET_NOT_FOUND', 'تذكرة الدعم أو النزاع غير موجودة.');
      }

      const nextStatus = status || ticket.status;
      const nextPriority = priority || ticket.priority;

      let resolvedAt = ticket.resolved_at;
      let closedAt = ticket.closed_at;

      if (nextStatus === 'RESOLVED') {
        resolvedAt = resolvedAt || new Date();
        closedAt = null;
      } else if (nextStatus === 'CLOSED') {
        resolvedAt = resolvedAt || new Date();
        closedAt = closedAt || new Date();
      } else {
        resolvedAt = null;
        closedAt = null;
      }

      const updRes = await client.query(
        `UPDATE travora.support_tickets
         SET status = $2,
             priority = $3,
             assigned_to_user_id = COALESCE(assigned_to_user_id, $4),
             resolved_at = $5,
             closed_at = $6
         WHERE id = $1
         RETURNING *`,
        [ticketId, nextStatus, nextPriority, adminId, resolvedAt, closedAt]
      );

      if (replyMessage && replyMessage.trim()) {
        await client.query(
          `INSERT INTO travora.support_messages (ticket_id, ticket_user_id, author_user_id, sender_role, body)
           VALUES ($1, $2, $3, 'AGENT', $4)`,
          [ticketId, ticket.user_id, adminId, replyMessage.trim()]
        );
      }

      await client.query('COMMIT');
      return updRes.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  return {
    getProviders,
    createProvider,
    updateProviderStatus,
    getApplications,
    reviewApplication,
    getUsers,
    updateUser,
    getBookings,
    getDisputes,
    updateDispute,
  };
}

module.exports = createAdminOperationsService;
