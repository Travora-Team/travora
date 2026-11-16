const crypto = require('crypto');
const ApiError = require('../../shared/utils/ApiError');
const { slugify } = require('../../shared/utils/slugify');
const createAdminSeedService = require('../../modules/admin/services/adminSeed.service');

/**
 * Transport Provider Service
 * Handles all 3 transport sub-types:
 *  1. transport_company (شركات النقل السياحي والليموزين)
 *  2. car_owner         (أصحاب السيارات الخاصة بسائق)
 *  3. car_rental        (مكاتب وشركات استئجار السيارات)
 */
function createTransportProviderService(pool) {
  const adminSeedService = createAdminSeedService(pool);

  async function listTransportServices({ destinationSlug, serviceType, status = 'active' } = {}) {
    await adminSeedService.ensureSeedData();
    const params = [];
    const conditions = [];

    if (status && status !== 'all') {
      params.push(status);
      conditions.push(`t.status = $${params.length}`);
    }
    if (serviceType && serviceType !== 'all') {
      params.push(serviceType);
      conditions.push(`t.service_type = $${params.length}`);
    }
    if (destinationSlug) {
      params.push(destinationSlug);
      conditions.push(`d.slug = $${params.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const res = await pool.query(
      `SELECT t.*, d.name_ar AS destination_name, d.slug AS destination_slug, p.name_ar AS provider_name
       FROM travora.transport_services t
       JOIN travora.destinations d ON d.id = t.destination_id
       LEFT JOIN travora.providers p ON p.id = t.provider_id
       ${whereClause}
       ORDER BY t.created_at DESC`,
      params
    );
    return res.rows;
  }

  async function getTransportDashboard({ providerId, userId, subtype } = {}) {
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
         WHERE pca.category_code = 'transport' OR p.code = 'cairo-vip-limo'
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

    const servicesRes = providerRow
      ? await pool.query(
          `SELECT t.*, d.name_ar AS destination_name, d.slug AS destination_slug
           FROM travora.transport_services t
           JOIN travora.destinations d ON d.id = t.destination_id
           WHERE t.provider_id = $1
           ORDER BY t.created_at DESC`,
          [providerRow.id]
        )
      : { rows: [] };
    const services = servicesRes.rows;

    const serviceIds = services.map((s) => s.id);
    let bookings = [];
    if (serviceIds.length > 0) {
      const bRes = await pool.query(
        `SELECT b.id, b.reference, b.status, b.currency, b.total_minor, b.contact_name, b.contact_phone, b.created_at,
                tbd.passenger_count, tbd.luggage_count, tbd.pickup_label, tbd.dropoff_label, tbd.pickup_at_snapshot,
                t.name_ar AS service_name_ar, t.service_type
         FROM travora.transport_booking_details tbd
         JOIN travora.bookings b ON b.id = tbd.booking_id
         JOIN travora.transport_services t ON t.id = tbd.transport_service_id
         WHERE tbd.transport_service_id = ANY($1::uuid[])
         ORDER BY b.created_at DESC`,
        [serviceIds]
      );
      bookings = bRes.rows;
    }

    const details = application?.details_json || {};
    const transportSubtype =
      subtype ||
      application?.transport_subtype ||
      (providerRow?.organization_kind === 'individual' ? 'car_owner' : 'transport_company');

    const totalRevenueEgp = bookings.reduce(
      (sum, b) => sum + Math.round((Number(b.total_minor) || 0) / 100),
      0
    );

    const fleetSize =
      Number(details.fleetSize || details.rentalFleetCount) || Math.max(services.length, 6);

    return {
      provider: providerRow,
      application,
      transportSubtype,
      services,
      bookings,
      stats: {
        servicesCount: services.length,
        fleetSize,
        bookingsCount: bookings.length,
        totalRevenueEgp,
        coverageAreas:
          Array.isArray(details.coverageAreas) && details.coverageAreas.length > 0
            ? details.coverageAreas
            : ['القاهرة الكبرى', 'مطار القاهرة الدولي', 'الجيزة والأهرامات'],
        vehicleClasses:
          Array.isArray(details.vehicleClasses) && details.vehicleClasses.length > 0
            ? details.vehicleClasses
            : ['مرسيدس S-Class VIP', 'فان مرسيدس V-Class العائلي', 'سيارات SUV رباعية الدفع'],
      },
    };
  }

  async function addVehicleService(payload = {}) {
    await adminSeedService.ensureSeedData();
    const {
      providerId,
      nameAr,
      nameEn,
      serviceType = 'airport_transfer',
      seats = 4,
      luggageCapacity = 4,
      priceEgp = 2200,
      citySlug = 'cairo',
    } = payload;

    if (!nameAr || !String(nameAr).trim()) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'يرجى إدخال اسم السيارة أو خدمة النقل بالعربية.');
    }

    let targetProviderId = providerId;
    if (!targetProviderId) {
      const r = await pool.query(
        `SELECT p.id FROM travora.providers p
         LEFT JOIN travora.provider_category_assignments pca ON pca.provider_id = p.id
         WHERE pca.category_code = 'transport' OR p.code = 'cairo-vip-limo'
         ORDER BY p.created_at ASC LIMIT 1`
      );
      targetProviderId = r.rows[0]?.id;
    }

    const destRes = await pool.query(
      `SELECT id, name_ar FROM travora.destinations WHERE slug = $1 OR slug = 'cairo' ORDER BY slug = $1 DESC LIMIT 1`,
      [citySlug]
    );
    const dest = destRes.rows[0];

    const validServiceType = ['airport_transfer', 'private_car', 'intercity', 'shuttle'].includes(serviceType)
      ? serviceType
      : 'private_car';

    const slug = `${slugify(nameEn || nameAr)}-${crypto.randomBytes(2).toString('hex')}`;
    const priceMinor = Math.max(10000, Math.round((Number(priceEgp) || 1500) * 100));

    const res = await pool.query(
      `INSERT INTO travora.transport_services
         (destination_id, provider_id, origin_destination_id, slug, name_ar, name_en, description_ar, description_en, service_type, pricing_model, seats, luggage_capacity, duration_minutes, price_minor, currency, cancellation_hours, status)
       VALUES ($1, $2, $1, $3, $4, $5, $6, $5, $7, 'per_vehicle', $8, $9, 120, $10, 'EGP', 12, 'active')
       RETURNING *`,
      [
        dest.id,
        targetProviderId,
        slug,
        String(nameAr).trim(),
        String(nameEn || nameAr).trim(),
        `خدمة نقل وسيارات حديثة (${nameAr}) في ${dest.name_ar}`,
        validServiceType,
        Math.max(1, Number(seats) || 4),
        Math.max(0, Number(luggageCapacity) || 3),
        priceMinor,
      ]
    );

    return res.rows[0];
  }

  async function createDraftTransportForProvider(
    client,
    { providerId, destination, cleanNameAr, cleanNameEn, transportSubtype, details = {} }
  ) {
    if (!destination) return null;
    const itemSlug = `${slugify(cleanNameEn || cleanNameAr)}-${crypto.randomBytes(2).toString('hex')}`;
    const descAr = String(details.descriptionAr || `خدمة نقل وسيارات مقدمة من ${cleanNameAr} في ${destination.name_ar}.`).trim();
    const seats = Math.max(1, Number(details.seats) || (transportSubtype === 'transport_company' ? 7 : 4));
    const luggage = Math.max(0, Number(details.luggageCapacity) || 4);
    const priceEgp = Math.max(100, Number(details.startingPriceEgp || details.dailyRateEgp) || 1500);
    const serviceType =
      details.airportTransfer === true || transportSubtype === 'transport_company'
        ? 'airport_transfer'
        : 'private_car';

    const res = await client.query(
      `INSERT INTO travora.transport_services
         (destination_id, provider_id, origin_destination_id, slug, name_ar, name_en, description_ar, description_en, service_type, pricing_model, seats, luggage_capacity, duration_minutes, price_minor, currency, cancellation_hours, status)
       VALUES ($1, $2, $1, $3, $4, $5, $6, $5, $7, 'per_vehicle', $8, $9, 120, $10, 'EGP', 12, 'draft')
       RETURNING *`,
      [
        destination.id,
        providerId,
        itemSlug,
        cleanNameAr,
        cleanNameEn,
        descAr,
        serviceType,
        seats,
        luggage,
        Math.round(priceEgp * 100),
      ]
    );
    return res.rows[0];
  }

  async function updateTransportStatus(transportId, status) {
    if (!['draft', 'active', 'archived'].includes(status)) {
      throw new ApiError(400, 'INVALID_STATUS', 'حالة خدمة النقل غير صالحة.');
    }
    const res = await pool.query(
      `UPDATE travora.transport_services SET status = $2 WHERE id = $1 RETURNING *`,
      [transportId, status]
    );
    if (!res.rows[0]) {
      throw new ApiError(404, 'TRANSPORT_NOT_FOUND', 'خدمة النقل غير موجودة.');
    }
    return res.rows[0];
  }

  return {
    listTransportServices,
    getTransportDashboard,
    addVehicleService,
    createDraftTransportForProvider,
    updateTransportStatus,
  };
}

module.exports = createTransportProviderService;
