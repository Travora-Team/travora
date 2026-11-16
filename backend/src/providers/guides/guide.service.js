const crypto = require('crypto');
const ApiError = require('../../shared/utils/ApiError');
const { slugify } = require('../../shared/utils/slugify');
const createAdminSeedService = require('../../modules/admin/services/adminSeed.service');

const DEFAULT_GUIDE_TOURS = [
  {
    id: 'tour-1',
    titleAr: 'جولة وادي الملوك ومعبد حتشبسوت الملكية الخاصة',
    durationHours: 6,
    languages: 'العربية • الإنجليزية • الفرنسية',
    maxGroupSize: 6,
    pricePerDayEgp: 3500,
    meetingPoint: 'رصيف البر الغربي الملكي - الأقصر',
    status: 'active',
  },
  {
    id: 'tour-2',
    titleAr: 'أسرار معبد الكرنك والأقصر ليلاً مع شرح هيروغليفي',
    durationHours: 4,
    languages: 'العربية • الإنجليزية',
    maxGroupSize: 8,
    pricePerDayEgp: 2600,
    meetingPoint: 'بوابة طريق الكباش الرئيسية - الأقصر',
    status: 'active',
  },
  {
    id: 'tour-3',
    titleAr: 'مرافقة VIP ليوم كامل بين معابد إدفو وكوم أمبو',
    durationHours: 8,
    languages: 'العربية • الإنجليزية • الفرنسية',
    maxGroupSize: 4,
    pricePerDayEgp: 4200,
    meetingPoint: 'مرسى الذهبيات النيلية - الأقصر / أسوان',
    status: 'active',
  },
];

const DEFAULT_GUIDE_BOOKINGS = [
  {
    id: 'gb-1',
    reference: 'GDE-2026-801',
    travelerName: 'عمر حسن الشافعي',
    tourTitle: 'جولة وادي الملوك ومعبد حتشبسوت الملكية الخاصة',
    tourDate: 'غداً — 08:30 صباحاً',
    language: 'العربية والإنجليزية',
    guestsCount: 4,
    amountEgp: 3500,
    status: 'confirmed',
  },
  {
    id: 'gb-2',
    reference: 'GDE-2026-804',
    travelerName: 'سارة الخليل',
    tourTitle: 'أسرار معبد الكرنك والأقصر ليلاً',
    tourDate: 'بعد يومين — 06:00 مساءً',
    language: 'الفرنسية',
    guestsCount: 2,
    amountEgp: 2600,
    status: 'confirmed',
  },
];

function createGuideProviderService(pool) {
  const adminSeedService = createAdminSeedService(pool);

  async function listGuides({ destinationSlug, status = 'active' } = {}) {
    await adminSeedService.ensureSeedData();
    const params = [];
    const conditions = [];

    if (status && status !== 'all') {
      params.push(status);
      conditions.push(`g.status = $${params.length}`);
    }
    if (destinationSlug) {
      params.push(destinationSlug);
      conditions.push(`d.slug = $${params.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const res = await pool.query(
      `SELECT g.*, d.name_ar AS destination_name, d.slug AS destination_slug, p.name_ar AS provider_name
       FROM travora.guide_profiles g
       JOIN travora.destinations d ON d.id = g.destination_id
       LEFT JOIN travora.providers p ON p.id = g.provider_id
       ${whereClause}
       ORDER BY g.created_at DESC`,
      params
    );
    return res.rows;
  }

  async function getGuideDashboard({ providerId, userId } = {}) {
    await adminSeedService.ensureSeedData();

    let providerRow = null;
    if (providerId) {
      const r = await pool.query(`SELECT * FROM travora.providers WHERE id = $1 LIMIT 1`, [providerId]);
      providerRow = r.rows[0];
    }
    if (!providerRow && userId) {
      const r = await pool.query(
        `SELECT * FROM travora.providers WHERE owner_user_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [userId]
      );
      providerRow = r.rows[0];
    }
    if (!providerRow) {
      const r = await pool.query(
        `SELECT p.* FROM travora.providers p
         LEFT JOIN travora.provider_category_assignments pca ON pca.provider_id = p.id
         WHERE pca.category_code = 'guide' OR p.code = 'luxor-royal-guides'
         ORDER BY p.status = 'active' DESC, p.created_at ASC LIMIT 1`
      );
      providerRow = r.rows[0];
    }

    const appRes = providerRow
      ? await pool.query(
          `SELECT * FROM travora.provider_applications WHERE provider_id = $1 ORDER BY submitted_at DESC LIMIT 1`,
          [providerRow.id]
        )
      : { rows: [] };
    const application = appRes.rows[0] || null;

    const guidesRes = providerRow
      ? await pool.query(
          `SELECT g.*, d.name_ar AS destination_name, d.slug AS destination_slug
           FROM travora.guide_profiles g
           JOIN travora.destinations d ON d.id = g.destination_id
           WHERE g.provider_id = $1
           ORDER BY g.created_at DESC`,
          [providerRow.id]
        )
      : { rows: [] };
    const guides = guidesRes.rows;

    const details = application?.details_json || {};
    const tours = Array.isArray(details.tours) && details.tours.length > 0 ? details.tours : DEFAULT_GUIDE_TOURS;
    const bookings =
      Array.isArray(details.guideBookings) && details.guideBookings.length > 0
        ? details.guideBookings
        : DEFAULT_GUIDE_BOOKINGS;

    const languages =
      Array.isArray(details.languages) && details.languages.length > 0
        ? details.languages
        : ['العربية', 'الإنجليزية', 'الفرنسية'];
    const specialties =
      Array.isArray(details.specialties) && details.specialties.length > 0
        ? details.specialties
        : ['الآثار المصرية القديمة', 'الجولات الملكية الخاصة VIP', 'المعابد والمتاحف'];

    const experienceYears = Number(details.experienceYears) || 15;
    const dailyRateEgp = Number(details.dailyRateEgp) || 3200;
    const licenseReference = guides[0]?.license_reference || application?.registration_reference || 'EG-GUIDE-LUX-8841';
    const totalRevenueEgp = bookings.reduce((sum, b) => sum + (Number(b.amountEgp) || 0), 0);

    return {
      provider: providerRow,
      application,
      guides,
      tours,
      bookings,
      stats: {
        guidesCount: guides.length,
        toursCount: tours.length,
        bookingsCount: bookings.length,
        languages,
        specialties,
        experienceYears,
        dailyRateEgp,
        licenseReference,
        totalRevenueEgp,
      },
    };
  }

  async function addGuidedTour(payload = {}) {
    await adminSeedService.ensureSeedData();
    const {
      providerId,
      titleAr,
      durationHours = 5,
      languages = 'العربية • الإنجليزية',
      maxGroupSize = 6,
      pricePerDayEgp = 3000,
      meetingPoint = 'نقطة التجمع الرئيسية بالمعلم السياحي',
    } = payload;

    if (!titleAr || !String(titleAr).trim()) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'يرجى إدخال عنوان البرنامج أو الجولة الإرشادية.');
    }

    let targetProviderId = providerId;
    if (!targetProviderId) {
      const r = await pool.query(
        `SELECT p.id FROM travora.providers p
         LEFT JOIN travora.provider_category_assignments pca ON pca.provider_id = p.id
         WHERE pca.category_code = 'guide' OR p.code = 'luxor-royal-guides'
         ORDER BY p.created_at ASC LIMIT 1`
      );
      targetProviderId = r.rows[0]?.id;
    }

    const appRes = await pool.query(
      `SELECT id, details_json FROM travora.provider_applications WHERE provider_id = $1 ORDER BY submitted_at DESC LIMIT 1`,
      [targetProviderId]
    );
    const appRow = appRes.rows[0];
    const currentDetails = appRow?.details_json || {};
    const existingTours =
      Array.isArray(currentDetails.tours) && currentDetails.tours.length > 0
        ? currentDetails.tours
        : DEFAULT_GUIDE_TOURS;

    const newTour = {
      id: `tour-${Date.now()}`,
      titleAr: String(titleAr).trim(),
      durationHours: Math.max(1, Number(durationHours) || 4),
      languages: String(languages).trim(),
      maxGroupSize: Math.max(1, Number(maxGroupSize) || 6),
      pricePerDayEgp: Math.max(200, Number(pricePerDayEgp) || 2800),
      meetingPoint: String(meetingPoint).trim(),
      status: 'active',
    };

    const updatedDetails = {
      ...currentDetails,
      tours: [newTour, ...existingTours],
    };

    if (appRow) {
      await pool.query(
        `UPDATE travora.provider_applications SET details_json = $2::jsonb WHERE id = $1`,
        [appRow.id, JSON.stringify(updatedDetails)]
      );
    }

    return newTour;
  }

  async function createDraftGuideForProvider(client, { providerId, destination, cleanNameAr, cleanNameEn, regRef, details = {} }) {
    if (!destination) return null;
    const itemSlug = `${slugify(cleanNameEn || cleanNameAr)}-${crypto.randomBytes(2).toString('hex')}`;
    const descAr = String(details.descriptionAr || `مرشد سياحي مرخص في ${destination.name_ar}.`).trim();

    const res = await client.query(
      `INSERT INTO travora.guide_profiles
         (provider_id, destination_id, slug, name_ar, name_en, bio_ar, bio_en, license_reference, currency, cancellation_hours, status)
       VALUES ($1, $2, $3, $4, $5, $6, $5, $7, 'EGP', 24, 'draft')
       RETURNING *`,
      [providerId, destination.id, itemSlug, cleanNameAr, cleanNameEn, descAr, regRef]
    );
    return res.rows[0];
  }

  async function updateGuideStatus(guideId, status) {
    if (!['draft', 'active', 'archived'].includes(status)) {
      throw new ApiError(400, 'INVALID_STATUS', 'حالة المرشد السياحي غير صالحة.');
    }
    const res = await pool.query(
      `UPDATE travora.guide_profiles SET status = $2 WHERE id = $1 RETURNING *`,
      [guideId, status]
    );
    if (!res.rows[0]) {
      throw new ApiError(404, 'GUIDE_NOT_FOUND', 'ملف المرشد السياحي غير موجود.');
    }
    return res.rows[0];
  }

  return {
    listGuides,
    getGuideDashboard,
    addGuidedTour,
    createDraftGuideForProvider,
    updateGuideStatus,
  };
}

module.exports = createGuideProviderService;
