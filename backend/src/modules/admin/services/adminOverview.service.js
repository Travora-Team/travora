const ApiError = require('../../../shared/utils/ApiError');

function createAdminOverviewService(pool, { ensureSeedData }) {
  async function getOverview(actorId) {
    await ensureSeedData(actorId);

    const [
      kpiRes,
      bookingsByKindRes,
      recentBookingsRes,
      pendingAppsRes,
      openDisputesRes,
      auditRes,
    ] = await Promise.all([
      pool.query(`
        SELECT
          (SELECT count(*)::int FROM travora.users WHERE deleted_at IS NULL) AS total_users,
          (SELECT count(*)::int FROM travora.users WHERE role = 'traveler' AND status = 'active') AS active_travelers,
          (SELECT count(*)::int FROM travora.providers) AS total_providers,
          (SELECT count(*)::int FROM travora.providers WHERE status = 'active') AS active_providers,
          (SELECT count(*)::int FROM travora.provider_applications WHERE status IN ('submitted', 'in_review')) AS pending_applications,
          (SELECT count(*)::int FROM travora.bookings) AS total_bookings,
          (SELECT count(*)::int FROM travora.bookings WHERE status IN ('confirmed', 'completed')) AS confirmed_bookings,
          (SELECT COALESCE(sum(total_minor), 0)::bigint FROM travora.bookings WHERE status IN ('confirmed', 'completed')) AS gross_bookings_minor,
          (SELECT COALESCE(sum(commission_minor), 0)::bigint FROM travora.settlement_items) AS total_commissions_minor,
          (SELECT COALESCE(sum(net_minor), 0)::bigint FROM travora.settlement_items) AS net_provider_minor,
          (SELECT COALESCE(sum(amount_minor), 0)::bigint FROM travora.provider_payouts WHERE status = 'succeeded') AS paid_out_minor,
          (SELECT count(*)::int FROM travora.support_tickets WHERE status IN ('OPEN', 'WAITING_AGENT', 'WAITING_CUSTOMER')) AS open_disputes,
          (SELECT count(*)::int FROM travora.support_tickets WHERE priority = 'URGENT' AND status NOT IN ('RESOLVED', 'CLOSED')) AS urgent_disputes
      `),
      pool.query(`
        SELECT
          b.kind,
          count(*)::int AS count,
          COALESCE(sum(b.total_minor), 0)::bigint AS total_minor
        FROM travora.bookings b
        GROUP BY b.kind
        ORDER BY total_minor DESC
      `),
      pool.query(`
        SELECT
          b.id, b.reference, b.kind, b.status, b.currency,
          b.subtotal_minor, b.tax_minor, b.fee_minor, b.total_minor,
          b.service_title_snapshot, b.contact_name, b.contact_email,
          b.created_at, b.confirmed_at,
          p.name_ar AS provider_name
        FROM travora.bookings b
        LEFT JOIN travora.providers p ON p.id = b.provider_id
        ORDER BY b.created_at DESC
        LIMIT 8
      `),
      pool.query(`
        SELECT
          a.id, a.provider_id, p.organization_kind,
          COALESCE(array_agg(DISTINCT pca.category_code) FILTER (WHERE pca.category_code IS NOT NULL), '{}') AS requested_categories,
          a.legal_name, p.name_ar AS trade_name, p.contact_email, p.phone_e164 AS contact_phone,
          a.registration_reference, a.status, a.submitted_at, a.decision_notes,
          a.partner_type, a.transport_subtype, a.city_slug, a.details_json,
          p.code AS provider_code, p.name_ar AS public_name_ar, p.name_en AS public_name_en,
          u.display_name AS applicant_name
        FROM travora.provider_applications a
        JOIN travora.providers p ON p.id = a.provider_id
        LEFT JOIN travora.provider_category_assignments pca ON pca.provider_id = p.id
        LEFT JOIN travora.users u ON u.id = a.applicant_user_id
        GROUP BY a.id, p.id, u.display_name
        ORDER BY
          CASE WHEN a.status IN ('submitted', 'in_review') THEN 0 ELSE 1 END,
          a.created_at DESC
        LIMIT 6
      `),
      pool.query(`
        SELECT
          t.id, t.subject, t.category, t.status, t.priority, t.created_at,
          u.display_name AS customer_name, u.email AS customer_email,
          b.reference AS booking_reference
        FROM travora.support_tickets t
        JOIN travora.users u ON u.id = t.user_id
        LEFT JOIN travora.bookings b ON b.id = t.booking_id
        ORDER BY
          CASE t.priority WHEN 'URGENT' THEN 1 WHEN 'HIGH' THEN 2 WHEN 'NORMAL' THEN 3 ELSE 4 END,
          t.created_at DESC
        LIMIT 6
      `),
      pool.query(`
        SELECT
          e.id, e.action, e.entity_type, e.summary, e.occurred_at,
          p.name_ar AS provider_name,
          u.display_name AS actor_name
        FROM travora.provider_audit_events e
        LEFT JOIN travora.providers p ON p.id = e.provider_id
        LEFT JOIN travora.users u ON u.id = e.actor_user_id
        ORDER BY e.occurred_at DESC
        LIMIT 8
      `),
    ]);

    return {
      kpis: kpiRes.rows[0],
      bookingsByKind: bookingsByKindRes.rows,
      recentBookings: recentBookingsRes.rows,
      pendingApplications: pendingAppsRes.rows,
      openDisputes: openDisputesRes.rows,
      recentAuditEvents: auditRes.rows,
    };
  }

  async function getAuditLogs({ search, entityType } = {}) {
    await ensureSeedData();
    const params = [];
    const conditions = [];

    if (entityType && entityType !== 'all') {
      params.push(entityType);
      conditions.push(`e.entity_type = $${params.length}`);
    }
    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      conditions.push(`(e.action ILIKE $${params.length} OR e.summary ILIKE $${params.length} OR p.name_ar ILIKE $${params.length})`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const res = await pool.query(
      `SELECT
         e.id, e.provider_id, e.actor_user_id, e.action, e.entity_type,
         e.entity_id, e.occurred_at, e.summary,
         p.name_ar AS provider_name, p.code AS provider_code,
         u.display_name AS actor_name, u.email AS actor_email
       FROM travora.provider_audit_events e
       LEFT JOIN travora.providers p ON p.id = e.provider_id
       LEFT JOIN travora.users u ON u.id = e.actor_user_id
       ${whereClause}
       ORDER BY e.occurred_at DESC
       LIMIT 100`,
      params
    );
    return res.rows;
  }

  async function getSettings() {
    await ensureSeedData();
    const [currenciesRes, countriesRes, pagesRes, faqsRes, categoriesRes] = await Promise.all([
      pool.query(`SELECT * FROM travora.currencies ORDER BY code ASC`),
      pool.query(`SELECT * FROM travora.countries ORDER BY code ASC`),
      pool.query(`SELECT * FROM travora.content_pages ORDER BY updated_at DESC`),
      pool.query(`SELECT * FROM travora.faq_entries ORDER BY sort_order ASC, created_at DESC`),
      pool.query(`SELECT * FROM travora.provider_categories ORDER BY code ASC`),
    ]);

    return {
      currencies: currenciesRes.rows,
      countries: countriesRes.rows,
      contentPages: pagesRes.rows,
      faqs: faqsRes.rows,
      providerCategories: categoriesRes.rows,
    };
  }

  async function createFaqEntry({ category = 'GENERAL', question, answerMarkdown }) {
    if (!question || !answerMarkdown) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'يرجى إدخال السؤال والإجابة.');
    }
    const res = await pool.query(
      `INSERT INTO travora.faq_entries (locale, category, question, answer_markdown, sort_order, is_published)
       VALUES ('ar', $1, $2, $3, 10, true)
       ON CONFLICT (locale, question) DO UPDATE SET answer_markdown = EXCLUDED.answer_markdown, is_published = true
       RETURNING *`,
      [category, question.trim(), answerMarkdown.trim()]
    );
    return res.rows[0];
  }

  return {
    getOverview,
    getAuditLogs,
    getSettings,
    createFaqEntry,
  };
}

module.exports = createAdminOverviewService;
