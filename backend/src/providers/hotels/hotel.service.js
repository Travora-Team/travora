const crypto = require('crypto');
const ApiError = require('../../shared/utils/ApiError');
const { slugify } = require('../../shared/utils/slugify');
const createAdminSeedService = require('../../modules/admin/services/adminSeed.service');

function createHotelProviderService(pool) {
  const adminSeedService = createAdminSeedService(pool);

  async function listHotels({ destinationSlug, status = 'active' } = {}) {
    await adminSeedService.ensureSeedData();
    const params = [];
    const conditions = [];

    if (status && status !== 'all') {
      params.push(status);
      conditions.push(`h.status = $${params.length}`);
    }
    if (destinationSlug) {
      params.push(destinationSlug);
      conditions.push(`d.slug = $${params.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const res = await pool.query(
      `SELECT h.*, d.name_ar AS destination_name, d.slug AS destination_slug, p.name_ar AS provider_name
       FROM travora.hotels h
       JOIN travora.destinations d ON d.id = h.destination_id
       LEFT JOIN travora.providers p ON p.id = h.provider_id
       ${whereClause}
       ORDER BY h.created_at DESC`,
      params
    );
    return res.rows;
  }

  async function getHotelDashboard({ providerId, userId } = {}) {
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
         WHERE pca.category_code = 'hotel' OR p.code = 'nile-palace-hospitality'
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

    const hotelsRes = providerRow
      ? await pool.query(
          `SELECT h.*, d.name_ar AS destination_name, d.slug AS destination_slug
           FROM travora.hotels h
           JOIN travora.destinations d ON d.id = h.destination_id
           WHERE h.provider_id = $1
           ORDER BY h.created_at DESC`,
          [providerRow.id]
        )
      : { rows: [] };
    const hotels = hotelsRes.rows;

    const hotelIds = hotels.map((h) => h.id);
    let roomTypes = [];
    if (hotelIds.length > 0) {
      const rtRes = await pool.query(
        `SELECT rt.*,
                h.name_ar AS hotel_name_ar,
                COALESCE((SELECT ri.price_minor FROM travora.room_inventory ri WHERE ri.room_type_id = rt.id ORDER BY ri.inventory_date ASC LIMIT 1), 650000) AS nightly_price_minor,
                COALESCE((SELECT ri.total_units FROM travora.room_inventory ri WHERE ri.room_type_id = rt.id ORDER BY ri.inventory_date ASC LIMIT 1), 8) AS total_units
         FROM travora.room_types rt
         JOIN travora.hotels h ON h.id = rt.hotel_id
         WHERE rt.hotel_id = ANY($1::uuid[])
         ORDER BY rt.created_at DESC`,
        [hotelIds]
      );
      roomTypes = rtRes.rows;
    }

    let bookings = [];
    if (hotelIds.length > 0) {
      const bRes = await pool.query(
        `SELECT b.id, b.reference, b.status, b.currency, b.total_minor, b.contact_name, b.contact_phone, b.created_at,
                hbd.check_in, hbd.check_out, hbd.room_count, hbd.adult_count, hbd.room_name_snapshot, hbd.meal_plan_snapshot,
                h.name_ar AS hotel_name_ar
         FROM travora.hotel_booking_details hbd
         JOIN travora.bookings b ON b.id = hbd.booking_id
         JOIN travora.hotels h ON h.id = hbd.hotel_id
         WHERE hbd.hotel_id = ANY($1::uuid[])
         ORDER BY b.created_at DESC`,
        [hotelIds]
      );
      bookings = bRes.rows;
    }

    const details = application?.details_json || {};
    const totalRevenueEgp = bookings.reduce((sum, b) => sum + Math.round((Number(b.total_minor) || 0) / 100), 0);
    const totalUnits = roomTypes.reduce((sum, r) => sum + (Number(r.total_units) || 0), 0) || Number(details.roomsCount) || 45;

    return {
      provider: providerRow,
      application,
      hotels,
      roomTypes,
      bookings,
      stats: {
        hotelsCount: hotels.length,
        roomTypesCount: roomTypes.length,
        totalUnits,
        bookingsCount: bookings.length,
        totalRevenueEgp,
        starRating: hotels[0]?.star_rating || details.starRating || 5,
      },
    };
  }

  async function createRoomTypeForHotel(payload = {}) {
    await adminSeedService.ensureSeedData();
    const {
      hotelId,
      providerId,
      nameAr,
      nameEn,
      bedDescriptionAr = 'سرير كينج ملكي فاخر',
      areaSqm = 55,
      maxOccupancy = 3,
      nightlyPriceEgp = 7500,
      totalUnits = 6,
    } = payload;

    if (!nameAr || !String(nameAr).trim()) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'يرجى إدخال اسم الغرفة أو الجناح بالعربية.');
    }

    let targetHotelId = hotelId;
    if (!targetHotelId && providerId) {
      const hRes = await pool.query(
        `SELECT id FROM travora.hotels WHERE provider_id = $1 ORDER BY created_at ASC LIMIT 1`,
        [providerId]
      );
      targetHotelId = hRes.rows[0]?.id;
    }
    if (!targetHotelId) {
      const hRes = await pool.query(`SELECT id FROM travora.hotels ORDER BY created_at ASC LIMIT 1`);
      targetHotelId = hRes.rows[0]?.id;
    }
    if (!targetHotelId) {
      throw new ApiError(404, 'HOTEL_NOT_FOUND', 'لم يتم العثور على فندق لإضافة الغرفة إليه.');
    }

    const code = `${slugify(nameEn || nameAr)}-${crypto.randomBytes(2).toString('hex')}`;
    const priceMinor = Math.max(10000, Math.round((Number(nightlyPriceEgp) || 5000) * 100));
    const units = Math.max(1, Number(totalUnits) || 5);
    const occ = Math.max(1, Number(maxOccupancy) || 2);

    const rtRes = await pool.query(
      `INSERT INTO travora.room_types
         (hotel_id, code, name_ar, name_en, description_ar, description_en, max_adults, max_children, max_occupancy, area_sqm, bed_description_ar, bed_description_en, status)
       VALUES ($1, $2, $3, $4, $5, $4, $6, 2, $6, $7, $8, $8, 'active')
       RETURNING *`,
      [
        targetHotelId,
        code,
        String(nameAr).trim(),
        String(nameEn || nameAr).trim(),
        `جناح/غرفة فندقية مجهزة بالكامل (${bedDescriptionAr})`,
        occ,
        Math.max(15, Number(areaSqm) || 45),
        String(bedDescriptionAr).trim(),
      ]
    );
    const roomType = rtRes.rows[0];

    for (let d = 0; d < 7; d++) {
      await pool.query(
        `INSERT INTO travora.room_inventory (room_type_id, inventory_date, total_units, price_minor, currency, is_closed)
         VALUES ($1, current_date + $2::int, $3, $4, 'EGP', false)
         ON CONFLICT (room_type_id, inventory_date) DO UPDATE
         SET total_units = EXCLUDED.total_units, price_minor = EXCLUDED.price_minor`,
        [roomType.id, d, units, priceMinor]
      );
    }

    return roomType;
  }

  async function createDraftHotelForProvider(client, { providerId, destination, cleanNameAr, cleanNameEn, details = {} }) {
    if (!destination) return null;
    const itemSlug = `${slugify(cleanNameEn || cleanNameAr)}-${crypto.randomBytes(2).toString('hex')}`;
    const descAr = String(details.descriptionAr || `إقامة فندقية مقدمة من ${cleanNameAr} في ${destination.name_ar}.`).trim();
    const addressAr = String(details.addressAr || destination.name_ar || 'مصر').trim();
    const starRating = Math.min(5, Math.max(1, Number(details.starRating) || 5));

    const res = await client.query(
      `INSERT INTO travora.hotels
         (destination_id, provider_id, slug, name_ar, name_en, description_ar, description_en, address_ar, address_en, star_rating, latitude, longitude, cancellation_hours, status)
       VALUES ($1, $2, $3, $4, $5, $6, $5, $7, $7, $8, $9, $10, 24, 'draft')
       RETURNING *`,
      [
        destination.id,
        providerId,
        itemSlug,
        cleanNameAr,
        cleanNameEn,
        descAr,
        addressAr,
        starRating,
        destination.latitude || 30.0444,
        destination.longitude || 31.2357,
      ]
    );
    return res.rows[0];
  }

  async function updateHotelStatus(hotelId, status) {
    if (!['draft', 'active', 'archived'].includes(status)) {
      throw new ApiError(400, 'INVALID_STATUS', 'حالة الفندق غير صالحة.');
    }
    const res = await pool.query(
      `UPDATE travora.hotels SET status = $2 WHERE id = $1 RETURNING *`,
      [hotelId, status]
    );
    if (!res.rows[0]) {
      throw new ApiError(404, 'HOTEL_NOT_FOUND', 'الفندق غير موجود.');
    }
    return res.rows[0];
  }

  return {
    listHotels,
    getHotelDashboard,
    createRoomTypeForHotel,
    createDraftHotelForProvider,
    updateHotelStatus,
  };
}

module.exports = createHotelProviderService;
