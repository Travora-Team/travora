const crypto = require('crypto');
const ApiError = require('../../shared/utils/ApiError');
const { slugify } = require('../../shared/utils/slugify');
const createAdminSeedService = require('../../modules/admin/services/adminSeed.service');

const DEFAULT_MENU_ITEMS = [
  {
    id: 'menu-1',
    nameAr: 'قائمة التذوق البحرية الملكية (5 أطباق)',
    categoryAr: 'قائمة عشاء تذوق Fine Dining',
    priceEgp: 1650,
    seatingZone: 'تراس البحيرة الفيروزية VIP',
    available: true,
  },
  {
    id: 'menu-2',
    nameAr: 'فيليه ستيك واغيو مشوي مع الكمأة السوداء',
    categoryAr: 'الأطباق الرئيسية الفاخرة',
    priceEgp: 1380,
    seatingZone: 'الصالة الملكية المكيفة',
    available: true,
  },
  {
    id: 'menu-3',
    nameAr: 'باقة عشاء الغروب الرومانسي لشخصين',
    categoryAr: 'باقات المناسبات الخاصة',
    priceEgp: 2900,
    seatingZone: 'إطلالة المارينا المباشرة',
    available: true,
  },
];

const DEFAULT_TABLE_RESERVATIONS = [
  {
    id: 'resv-101',
    reference: 'RES-2026-410',
    guestName: 'سارة الخليل',
    guestsCount: 4,
    reservationTime: '20:30 مساءً',
    zone: 'تراس البحيرة الفيروزية VIP',
    packageTitle: 'قائمة التذوق البحرية الملكية',
    status: 'confirmed',
    amountEgp: 6600,
  },
  {
    id: 'resv-102',
    reference: 'RES-2026-411',
    guestName: 'أحمد منصور',
    guestsCount: 2,
    reservationTime: '21:00 مساءً',
    zone: 'إطلالة المارينا المباشرة',
    packageTitle: 'باقة عشاء الغروب الرومانسي لشخصين',
    status: 'confirmed',
    amountEgp: 2900,
  },
];

function createRestaurantProviderService(pool) {
  const adminSeedService = createAdminSeedService(pool);

  async function listRestaurants({ destinationSlug, status = 'active' } = {}) {
    await adminSeedService.ensureSeedData();
    const params = [];
    const conditions = [];

    if (status && status !== 'all') {
      params.push(status);
      conditions.push(`r.status = $${params.length}`);
    }
    if (destinationSlug) {
      params.push(destinationSlug);
      conditions.push(`d.slug = $${params.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const res = await pool.query(
      `SELECT r.*, d.name_ar AS destination_name, d.slug AS destination_slug, p.name_ar AS provider_name
       FROM travora.restaurants r
       JOIN travora.destinations d ON d.id = r.destination_id
       LEFT JOIN travora.providers p ON p.id = r.provider_id
       ${whereClause}
       ORDER BY r.created_at DESC`,
      params
    );
    return res.rows;
  }

  async function getRestaurantDashboard({ providerId, userId } = {}) {
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
         WHERE pca.category_code = 'restaurant' OR p.code = 'elgouna-fine-dining'
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

    const restRes = providerRow
      ? await pool.query(
          `SELECT r.*, d.name_ar AS destination_name, d.slug AS destination_slug
           FROM travora.restaurants r
           JOIN travora.destinations d ON d.id = r.destination_id
           WHERE r.provider_id = $1
           ORDER BY r.created_at DESC`,
          [providerRow.id]
        )
      : { rows: [] };
    const restaurants = restRes.rows;

    const details = application?.details_json || {};
    const menuItems = Array.isArray(details.menuItems) && details.menuItems.length > 0
      ? details.menuItems
      : DEFAULT_MENU_ITEMS;
    const reservations = Array.isArray(details.reservations) && details.reservations.length > 0
      ? details.reservations
      : DEFAULT_TABLE_RESERVATIONS;

    const seatingCapacity = Number(details.seatingCapacity) || 95;
    const avgMealPriceEgp = Number(details.avgMealPriceEgp) || 1250;
    const openingHours = details.openingHours || '12:00 ظهراً - 01:00 منتصف الليل';
    const cuisineAr = restaurants[0]?.cuisine_ar || details.cuisineAr || 'فرنسي وبحري فاخر';
    const totalRevenueEgp = reservations.reduce((sum, r) => sum + (Number(r.amountEgp) || 0), 0);

    return {
      provider: providerRow,
      application,
      restaurants,
      menuItems,
      reservations,
      stats: {
        restaurantsCount: restaurants.length,
        seatingCapacity,
        avgMealPriceEgp,
        openingHours,
        cuisineAr,
        menuItemsCount: menuItems.length,
        reservationsCount: reservations.length,
        totalRevenueEgp,
      },
    };
  }

  async function addMenuItem(payload = {}) {
    await adminSeedService.ensureSeedData();
    const {
      providerId,
      nameAr,
      categoryAr = 'الأطباق والباقات الفاخرة',
      priceEgp = 950,
      seatingZone = 'الصالة الرئيسية والتراس',
    } = payload;

    if (!nameAr || !String(nameAr).trim()) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'يرجى إدخال اسم الطبق أو باقة الطعام.');
    }

    let targetProviderId = providerId;
    if (!targetProviderId) {
      const r = await pool.query(
        `SELECT p.id FROM travora.providers p
         LEFT JOIN travora.provider_category_assignments pca ON pca.provider_id = p.id
         WHERE pca.category_code = 'restaurant' OR p.code = 'elgouna-fine-dining'
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
    const existingMenu =
      Array.isArray(currentDetails.menuItems) && currentDetails.menuItems.length > 0
        ? currentDetails.menuItems
        : DEFAULT_MENU_ITEMS;

    const newItem = {
      id: `menu-${Date.now()}`,
      nameAr: String(nameAr).trim(),
      categoryAr: String(categoryAr).trim(),
      priceEgp: Math.max(50, Number(priceEgp) || 850),
      seatingZone: String(seatingZone).trim(),
      available: true,
    };

    const updatedDetails = {
      ...currentDetails,
      menuItems: [newItem, ...existingMenu],
    };

    if (appRow) {
      await pool.query(
        `UPDATE travora.provider_applications SET details_json = $2::jsonb WHERE id = $1`,
        [appRow.id, JSON.stringify(updatedDetails)]
      );
    }

    return newItem;
  }

  async function createDraftRestaurantForProvider(client, { providerId, destination, cleanNameAr, cleanNameEn, details = {} }) {
    if (!destination) return null;
    const itemSlug = `${slugify(cleanNameEn || cleanNameAr)}-${crypto.randomBytes(2).toString('hex')}`;
    const descAr = String(details.descriptionAr || `تجربة طعام وضيافة مقدمة من ${cleanNameAr} في ${destination.name_ar}.`).trim();
    const addressAr = String(details.addressAr || destination.name_ar || 'مصر').trim();
    const cuisineAr = String(details.cuisineAr || 'مأكولات مصرية وعالمية فاخرة').trim();

    const res = await client.query(
      `INSERT INTO travora.restaurants
         (destination_id, provider_id, slug, name_ar, name_en, description_ar, description_en, cuisine_ar, cuisine_en, address_ar, address_en, timezone, latitude, longitude, currency, cancellation_hours, status)
       VALUES ($1, $2, $3, $4, $5, $6, $5, $7, $7, $8, $8, 'Africa/Cairo', $9, $10, 'EGP', 12, 'draft')
       RETURNING *`,
      [
        destination.id,
        providerId,
        itemSlug,
        cleanNameAr,
        cleanNameEn,
        descAr,
        cuisineAr,
        addressAr,
        destination.latitude || 30.0444,
        destination.longitude || 31.2357,
      ]
    );
    return res.rows[0];
  }

  async function updateRestaurantStatus(restaurantId, status) {
    if (!['draft', 'active', 'archived'].includes(status)) {
      throw new ApiError(400, 'INVALID_STATUS', 'حالة المطعم غير صالحة.');
    }
    const res = await pool.query(
      `UPDATE travora.restaurants SET status = $2 WHERE id = $1 RETURNING *`,
      [restaurantId, status]
    );
    if (!res.rows[0]) {
      throw new ApiError(404, 'RESTAURANT_NOT_FOUND', 'المطعم غير موجود.');
    }
    return res.rows[0];
  }

  return {
    listRestaurants,
    getRestaurantDashboard,
    addMenuItem,
    createDraftRestaurantForProvider,
    updateRestaurantStatus,
  };
}

module.exports = createRestaurantProviderService;
