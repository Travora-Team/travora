const crypto = require('crypto');
const ApiError = require('../../../shared/utils/ApiError');
const { slugify } = require('../../../shared/utils/slugify');

function createAdminCatalogService(pool, { ensureSeedData, ensureDestinationsRichSchema }) {
  async function getPublicDestinations() {
    await ensureDestinationsRichSchema(pool);
    const [featuredRes, allRes] = await Promise.all([
      pool.query(`
        SELECT
          d.*,
          (SELECT count(*)::int FROM travora.hotels h WHERE h.destination_id = d.id AND h.status = 'active') AS hotels_count,
          (SELECT count(*)::int FROM travora.activities a WHERE a.destination_id = d.id AND a.status = 'active') AS activities_count
        FROM travora.destinations d
        WHERE d.status = 'active' AND d.is_featured = true
        ORDER BY d.display_order ASC, d.created_at ASC
      `),
      pool.query(`
        SELECT
          d.*,
          (SELECT count(*)::int FROM travora.hotels h WHERE h.destination_id = d.id AND h.status = 'active') AS hotels_count,
          (SELECT count(*)::int FROM travora.activities a WHERE a.destination_id = d.id AND a.status = 'active') AS activities_count
        FROM travora.destinations d
        WHERE d.status = 'active'
        ORDER BY d.display_order ASC, d.created_at ASC
      `),
    ]);

    return {
      featuredDestinations: featuredRes.rows,
      destinations: allRes.rows,
    };
  }

  async function getCatalog() {
    await ensureSeedData();
    const [destinationsRes, hotelsRes, activitiesRes, transportRes, restaurantsRes, guidesRes] = await Promise.all([
      pool.query(`
        SELECT d.*,
          (SELECT count(*)::int FROM travora.hotels h WHERE h.destination_id = d.id) AS hotels_count,
          (SELECT count(*)::int FROM travora.activities a WHERE a.destination_id = d.id) AS activities_count
        FROM travora.destinations d
        ORDER BY d.display_order ASC, d.created_at ASC
      `),
      pool.query(`
        SELECT h.*, d.name_ar AS destination_name, p.name_ar AS provider_name
        FROM travora.hotels h
        JOIN travora.destinations d ON d.id = h.destination_id
        LEFT JOIN travora.providers p ON p.id = h.provider_id
        ORDER BY h.created_at DESC
      `),
      pool.query(`
        SELECT a.*, d.name_ar AS destination_name, p.name_ar AS provider_name
        FROM travora.activities a
        JOIN travora.destinations d ON d.id = a.destination_id
        LEFT JOIN travora.providers p ON p.id = a.provider_id
        ORDER BY a.created_at DESC
      `),
      pool.query(`
        SELECT t.*, d.name_ar AS destination_name, p.name_ar AS provider_name
        FROM travora.transport_services t
        JOIN travora.destinations d ON d.id = t.destination_id
        LEFT JOIN travora.providers p ON p.id = t.provider_id
        ORDER BY t.created_at DESC
      `),
      pool.query(`
        SELECT r.*, d.name_ar AS destination_name, p.name_ar AS provider_name
        FROM travora.restaurants r
        JOIN travora.destinations d ON d.id = r.destination_id
        LEFT JOIN travora.providers p ON p.id = r.provider_id
        ORDER BY r.created_at DESC
      `),
      pool.query(`
        SELECT g.*, d.name_ar AS destination_name, p.name_ar AS provider_name
        FROM travora.guide_profiles g
        JOIN travora.destinations d ON d.id = g.destination_id
        LEFT JOIN travora.providers p ON p.id = g.provider_id
        ORDER BY g.created_at DESC
      `),
    ]);

    return {
      destinations: destinationsRes.rows,
      hotels: hotelsRes.rows,
      activities: activitiesRes.rows,
      transportServices: transportRes.rows,
      restaurants: restaurantsRes.rows,
      guides: guidesRes.rows,
    };
  }

  async function createDestination(payload) {
    await ensureDestinationsRichSchema(pool);
    const {
      nameAr,
      nameEn,
      descriptionAr,
      tagsAr = 'ثقافة • تاريخ • سياحة',
      imageUrl = 'cairo',
      countryLabelAr = 'مصر',
      categoryLabelAr = 'معالم',
      visitorsText = '+10K',
      rating = 4.8,
      ctaLabelAr = 'استكشف الآن',
      isFeatured = true,
      displayOrder = 10,
      kind = 'city',
      status = 'active',
    } = payload || {};

    if (!nameAr || !nameEn) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'يرجى إدخال اسم الوجهة بالعربية والإنجليزية.');
    }

    const normalizedStatus = ['active', 'draft', 'archived'].includes(status) ? status : 'active';
    const numericRating = Math.min(5, Math.max(1, Number(rating) || 4.8));
    const numericOrder = Number.isFinite(Number(displayOrder)) ? Number(displayOrder) : 10;
    const slug = `${slugify(nameEn)}-${crypto.randomBytes(2).toString('hex')}`;

    const res = await pool.query(
      `INSERT INTO travora.destinations
         (country_code, kind, slug, name_ar, name_en, description_ar, description_en,
          tags_ar, image_url, country_label_ar, category_label_ar, visitors_text, rating, cta_label_ar,
          is_featured, display_order, timezone, status)
       VALUES ('EG', $1, $2, $3, $4, $5, $4, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'Africa/Cairo', $15)
       RETURNING *`,
      [
        kind,
        slug,
        nameAr.trim(),
        nameEn.trim(),
        (descriptionAr || nameAr).trim(),
        String(tagsAr || 'ثقافة • تاريخ • سياحة').trim(),
        String(imageUrl || 'cairo').trim(),
        String(countryLabelAr || 'مصر').trim(),
        String(categoryLabelAr || 'معالم').trim(),
        String(visitorsText || '+10K').trim(),
        numericRating,
        String(ctaLabelAr || 'استكشف الآن').trim(),
        Boolean(isFeatured),
        numericOrder,
        normalizedStatus,
      ]
    );
    return res.rows[0];
  }

  async function updateDestination(id, payload) {
    await ensureDestinationsRichSchema(pool);
    const existingRes = await pool.query(`SELECT * FROM travora.destinations WHERE id = $1`, [id]);
    const existing = existingRes.rows[0];
    if (!existing) {
      throw new ApiError(404, 'DESTINATION_NOT_FOUND', 'الوجهة السياحية غير موجودة.');
    }

    const {
      nameAr,
      nameEn,
      descriptionAr,
      tagsAr,
      imageUrl,
      countryLabelAr,
      categoryLabelAr,
      visitorsText,
      rating,
      ctaLabelAr,
      isFeatured,
      displayOrder,
      status,
    } = payload || {};

    const nextStatus = status
      ? status === 'inactive'
        ? 'draft'
        : ['active', 'draft', 'archived'].includes(status)
          ? status
          : existing.status
      : existing.status;

    const nextRating =
      rating !== undefined && rating !== null
        ? Math.min(5, Math.max(1, Number(rating) || Number(existing.rating) || 4.8))
        : Number(existing.rating) || 4.8;

    const nextOrder =
      displayOrder !== undefined && displayOrder !== null
        ? Number.isFinite(Number(displayOrder))
          ? Number(displayOrder)
          : existing.display_order
        : existing.display_order;

    const res = await pool.query(
      `UPDATE travora.destinations
       SET name_ar = $2,
           name_en = $3,
           description_ar = $4,
           tags_ar = $5,
           image_url = $6,
           country_label_ar = $7,
           category_label_ar = $8,
           visitors_text = $9,
           rating = $10,
           cta_label_ar = $11,
           is_featured = $12,
           display_order = $13,
           status = $14
       WHERE id = $1
       RETURNING *`,
      [
        id,
        nameAr !== undefined ? String(nameAr).trim() : existing.name_ar,
        nameEn !== undefined ? String(nameEn).trim() : existing.name_en,
        descriptionAr !== undefined ? String(descriptionAr).trim() : existing.description_ar,
        tagsAr !== undefined ? String(tagsAr).trim() : existing.tags_ar,
        imageUrl !== undefined ? String(imageUrl).trim() : existing.image_url,
        countryLabelAr !== undefined ? String(countryLabelAr).trim() : existing.country_label_ar,
        categoryLabelAr !== undefined ? String(categoryLabelAr).trim() : existing.category_label_ar,
        visitorsText !== undefined ? String(visitorsText).trim() : existing.visitors_text,
        nextRating,
        ctaLabelAr !== undefined ? String(ctaLabelAr).trim() : existing.cta_label_ar,
        typeof isFeatured === 'boolean' ? isFeatured : existing.is_featured,
        nextOrder,
        nextStatus,
      ]
    );

    return res.rows[0];
  }

  async function deleteDestination(id) {
    await ensureDestinationsRichSchema(pool);
    try {
      const res = await pool.query(`DELETE FROM travora.destinations WHERE id = $1 RETURNING *`, [id]);
      if (!res.rows[0]) {
        throw new ApiError(404, 'DESTINATION_NOT_FOUND', 'الوجهة السياحية غير موجودة.');
      }
      return { deleted: true, destination: res.rows[0] };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      const archived = await pool.query(
        `UPDATE travora.destinations SET status = 'archived', is_featured = false WHERE id = $1 RETURNING *`,
        [id]
      );
      if (!archived.rows[0]) {
        throw new ApiError(404, 'DESTINATION_NOT_FOUND', 'الوجهة السياحية غير موجودة.');
      }
      return { deleted: false, archived: true, destination: archived.rows[0] };
    }
  }

  async function updateCatalogItemStatus(entityType, id, { status }) {
    const tableMap = {
      destination: 'destinations',
      hotel: 'hotels',
      activity: 'activities',
      transport: 'transport_services',
      restaurant: 'restaurants',
      guide: 'guide_profiles',
    };
    const table = tableMap[entityType];
    if (!table) {
      throw new ApiError(400, 'INVALID_CATALOG_TYPE', 'نوع عنصر الكتالوج غير صالح.');
    }

    const normalizedStatus = status === 'inactive' ? 'draft' : status;

    const r = await pool.query(
      `UPDATE travora.${table}
       SET status = $2
       WHERE id = $1
       RETURNING *`,
      [id, normalizedStatus]
    );
    if (!r.rows[0]) {
      throw new ApiError(404, 'ITEM_NOT_FOUND', 'العنصر غير موجود في الكتالوج.');
    }
    return r.rows[0];
  }

  return {
    getPublicDestinations,
    getCatalog,
    createDestination,
    updateDestination,
    deleteDestination,
    updateCatalogItemStatus,
  };
}

module.exports = createAdminCatalogService;
