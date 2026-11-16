const { hashPassword } = require('../../../shared/utils/password');

function createAdminSeedService(pool) {
  let seedPromise = null;
  let demoCredentialsEnsured = false;

  async function ensureDemoCredentials(clientOrPool = pool) {
    if (demoCredentialsEnsured) return;
    try {
      const pwHash = await hashPassword('Travora@2026!');

      // Ensure admin@travora.eg always exists as an active admin
      await clientOrPool.query(
        `INSERT INTO travora.users (email, email_verified_at, display_name, role, status)
         VALUES ('admin@travora.eg', now(), 'مدير منصة ترافورا', 'admin', 'active')
         ON CONFLICT (email) DO UPDATE SET role = 'admin', status = 'active', email_verified_at = COALESCE(travora.users.email_verified_at, now())`
      );

      const demoEmails = [
        'admin@travora.eg',
        'eng.yousif.fares@gmail.com',
        'nile.palace@travora.eg',
        'elgouna.dining@travora.eg',
        'luxor.guides@travora.eg',
        'cairo.vip.fleet@travora.eg',
        'siwa.oasis.resort@travora.eg',
        'ahmed.mansour@example.com',
      ];

      const usersRes = await clientOrPool.query(
        `SELECT id, email FROM travora.users WHERE email = ANY($1::text[])`,
        [demoEmails]
      );

      for (const u of usersRes.rows) {
        const existingAuth = await clientOrPool.query(
          `SELECT id FROM travora.auth_identities WHERE user_id = $1 AND provider = 'password' LIMIT 1`,
          [u.id]
        );
        if (!existingAuth.rows[0]) {
          await clientOrPool.query(
            `INSERT INTO travora.auth_identities (user_id, provider, provider_subject, password_hash)
             VALUES ($1, 'password', $2, $3)
             ON CONFLICT (provider, provider_subject) DO NOTHING`,
            [u.id, u.id, pwHash]
          );
        }
      }

      await clientOrPool.query(`
        UPDATE travora.provider_applications a
        SET partner_type = pca.category_code
        FROM travora.provider_category_assignments pca
        WHERE pca.provider_id = a.provider_id
          AND pca.category_code IN ('hotel', 'restaurant', 'guide', 'transport')
          AND a.partner_type <> pca.category_code
      `);

      demoCredentialsEnsured = true;
    } catch (err) {
      console.warn('[adminSeedService.ensureDemoCredentials] warning:', err.message);
    }
  }

  async function resolveAdminReviewerId(clientOrPool, preferredUserId) {
    if (preferredUserId) {
      const check = await clientOrPool.query(
        `SELECT id FROM travora.users WHERE id = $1 AND role = 'admin' AND status = 'active' LIMIT 1`,
        [preferredUserId]
      );
      if (check.rows[0]) return check.rows[0].id;
    }

    const existingAdmin = await clientOrPool.query(
      `SELECT id FROM travora.users WHERE role = 'admin' AND status = 'active' ORDER BY created_at ASC LIMIT 1`
    );
    if (existingAdmin.rows[0]) return existingAdmin.rows[0].id;

    // Promote eng.yousif.fares@gmail.com if present
    const promoted = await clientOrPool.query(
      `UPDATE travora.users
       SET role = 'admin', status = 'active', email_verified_at = COALESCE(email_verified_at, now())
       WHERE email = 'eng.yousif.fares@gmail.com'
       RETURNING id`
    );
    if (promoted.rows[0]) return promoted.rows[0].id;

    const created = await clientOrPool.query(
      `INSERT INTO travora.users (email, email_verified_at, display_name, role, status)
       VALUES ('admin@travora.eg', now(), 'مدير منصة ترافورا', 'admin', 'active')
       ON CONFLICT (email) DO UPDATE SET role = 'admin', status = 'active'
       RETURNING id`
    );
    return created.rows[0].id;
  }

  let destinationsSchemaEnsured = false;

  async function ensureDestinationsRichSchema(clientOrPool = pool) {
    if (destinationsSchemaEnsured) return;
    await clientOrPool.query(`
      ALTER TABLE travora.destinations
        ADD COLUMN IF NOT EXISTS tags_ar TEXT NOT NULL DEFAULT 'ثقافة • تاريخ • سياحة',
        ADD COLUMN IF NOT EXISTS image_url TEXT NOT NULL DEFAULT 'cairo',
        ADD COLUMN IF NOT EXISTS country_label_ar TEXT NOT NULL DEFAULT 'مصر',
        ADD COLUMN IF NOT EXISTS category_label_ar TEXT NOT NULL DEFAULT 'معالم',
        ADD COLUMN IF NOT EXISTS visitors_text TEXT NOT NULL DEFAULT '+12K',
        ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) NOT NULL DEFAULT 4.8,
        ADD COLUMN IF NOT EXISTS cta_label_ar TEXT NOT NULL DEFAULT 'استكشف الآن',
        ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT true,
        ADD COLUMN IF NOT EXISTS display_order INT NOT NULL DEFAULT 10
    `);

    await clientOrPool.query(`
      ALTER TABLE travora.provider_applications
        ADD COLUMN IF NOT EXISTS partner_type TEXT NOT NULL DEFAULT 'hotel',
        ADD COLUMN IF NOT EXISTS transport_subtype TEXT,
        ADD COLUMN IF NOT EXISTS city_slug TEXT NOT NULL DEFAULT 'cairo',
        ADD COLUMN IF NOT EXISTS details_json JSONB NOT NULL DEFAULT '{}'::jsonb
    `);

    await clientOrPool.query(`
      UPDATE travora.provider_applications a
      SET
        partner_type = COALESCE((SELECT pca.category_code FROM travora.provider_category_assignments pca WHERE pca.provider_id = a.provider_id LIMIT 1), 'hotel'),
        details_json = CASE
          WHEN a.legal_name ILIKE '%سيوة%' THEN '{"starRating":5,"roomsCount":42,"addressAr":"جبل جعفر، واحة سيوة","nightlyPriceEgp":7500,"amenities":["منتجع بيئي تراثي","عيون مياه طبيعية","عشاء صحراوي ملكي","طاقة شمسية صديقة للبيئة"],"descriptionAr":"منتجع بيئي فاخر مبني بالكرشيف السوي التقليدي وسط أشجار النخيل والزيتون."}'::jsonb
          WHEN a.legal_name ILIKE '%نفرتاري%' THEN '{"fleetSize":3,"vehicleClasses":["ذهبية نيلية ملكية 8 أجنحة","يخت شراعي فاخر"],"coverageAreas":["أسوان","الأقصر","معبد كوم أمبو","إدفو"],"startingPriceEgp":12000,"descriptionAr":"رحلات نيلية ملكية خاصة بين الأقصر وأسوان على متن ذهبيات نفرتاري التراثية الفاخرة."}'::jsonb
          ELSE a.details_json
        END
      WHERE a.details_json = '{}'::jsonb
        AND a.status IN ('draft', 'submitted', 'in_review')
    `);

    await clientOrPool.query(`
      INSERT INTO travora.countries (code, name_ar, name_en, default_currency)
      VALUES ('EG', 'جمهورية مصر العربية', 'Egypt', 'EGP')
      ON CONFLICT (code) DO NOTHING
    `);

    const gizaCheck = await clientOrPool.query(
      `SELECT id FROM travora.destinations WHERE slug = 'giza' LIMIT 1`
    );

    if (!gizaCheck.rows[0]) {
      const homeDestinationsSpec = [
        {
          slug: 'cairo',
          name_ar: 'القاهرة',
          name_en: 'Cairo',
          tags_ar: 'ثقافة • تاريخ • حياة عصرية',
          description_ar: 'عاصمة لا تنام تجمع بين عراقة التاريخ وحيوية الحاضر على ضفاف النيل.',
          country_label_ar: 'مصر',
          category_label_ar: 'معالم',
          visitors_text: '+12K',
          rating: 4.8,
          cta_label_ar: 'استكشف الآن',
          image_url: 'cairo',
          is_featured: true,
          display_order: 1,
          lat: 30.0444,
          lng: 31.2357,
        },
        {
          slug: 'giza',
          name_ar: 'الجيزة',
          name_en: 'Giza',
          tags_ar: 'آثار • مغامرة • استكشاف',
          description_ar: 'استكشف أهرامات الجيزة العظيمة، إحدى عجائب العالم حيث يلتقي التاريخ بالدهشة.',
          country_label_ar: 'مصر',
          category_label_ar: 'معالم',
          visitors_text: '+18K',
          rating: 4.9,
          cta_label_ar: 'استكشف الآن',
          image_url: 'giza',
          is_featured: true,
          display_order: 2,
          lat: 29.9792,
          lng: 31.1342,
        },
        {
          slug: 'luxor',
          name_ar: 'الأقصر',
          name_en: 'Luxor',
          tags_ar: 'حضارة • معابد • تاريخ',
          description_ar: 'متحف مفتوح في قلب الصعيد، حيث تعيش الحضارة الفرعونية في كل زاوية.',
          country_label_ar: 'مصر',
          category_label_ar: 'معالم',
          visitors_text: '+10K',
          rating: 4.7,
          cta_label_ar: 'استكشف الآن',
          image_url: 'luxor',
          is_featured: true,
          display_order: 3,
          lat: 25.6872,
          lng: 32.6396,
        },
        {
          slug: 'sharm-el-sheikh',
          name_ar: 'شرم الشيخ',
          name_en: 'Sharm El-Sheikh',
          tags_ar: 'شاطئ • غوص • استرخاء',
          description_ar: 'البحر الأحمر بتجاربه التي لا تُنسى بين الشعاب المرجانية والمياه الفيروزية.',
          country_label_ar: 'مصر',
          category_label_ar: 'معالم',
          visitors_text: '+14K',
          rating: 4.8,
          cta_label_ar: 'استكشف الآن',
          image_url: 'sharm',
          is_featured: true,
          display_order: 4,
          lat: 27.9158,
          lng: 34.3300,
        },
        {
          slug: 'el-gouna',
          name_ar: 'الجونة',
          name_en: 'El Gouna',
          tags_ar: 'بحيرات فيروزية • يخوت • فخامة',
          description_ar: 'وجهة الجزر الفيروزية والمطاعم العالمية واليخوت الخاصة على ساحل البحر الأحمر.',
          country_label_ar: 'مصر',
          category_label_ar: 'منتجعات',
          visitors_text: '+9K',
          rating: 4.9,
          cta_label_ar: 'استكشف الآن',
          image_url: 'sharm',
          is_featured: false,
          display_order: 5,
          lat: 27.3942,
          lng: 33.6782,
        },
        {
          slug: 'aswan',
          name_ar: 'أسوان',
          name_en: 'Aswan',
          tags_ar: 'نيل • تراث نوبي • استجمام',
          description_ar: 'الطبيعة الساحرة على ضفاف النيل ومعبد فيلة العريق والذهبيات الملكية.',
          country_label_ar: 'مصر',
          category_label_ar: 'معالم',
          visitors_text: '+8K',
          rating: 4.8,
          cta_label_ar: 'استكشف الآن',
          image_url: 'luxor',
          is_featured: false,
          display_order: 6,
          lat: 24.0889,
          lng: 32.8998,
        },
        {
          slug: 'siwa-oasis',
          name_ar: 'واحة سيوة',
          name_en: 'Siwa Oasis',
          tags_ar: 'واحة • طبيعة • سياحة بيئية',
          description_ar: 'ملاذ الهدوء والمنتجعات البيئية الفريدة والعيون الكبريتية وسط الصحراء الغربية.',
          country_label_ar: 'مصر',
          category_label_ar: 'طبيعة',
          visitors_text: '+6K',
          rating: 4.9,
          cta_label_ar: 'استكشف الآن',
          image_url: 'giza',
          is_featured: false,
          display_order: 7,
          lat: 29.2032,
          lng: 25.5195,
        },
      ];

      for (const d of homeDestinationsSpec) {
        await clientOrPool.query(
          `INSERT INTO travora.destinations
             (country_code, kind, slug, name_ar, name_en, description_ar, description_en,
              tags_ar, image_url, country_label_ar, category_label_ar, visitors_text, rating, cta_label_ar,
              is_featured, display_order, timezone, latitude, longitude, status)
           VALUES ('EG', 'city', $1, $2, $3, $4, $3, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'Africa/Cairo', $14, $15, 'active')
           ON CONFLICT (slug) DO UPDATE SET
             name_ar = EXCLUDED.name_ar,
             name_en = EXCLUDED.name_en,
             description_ar = EXCLUDED.description_ar,
             tags_ar = EXCLUDED.tags_ar,
             image_url = EXCLUDED.image_url,
             country_label_ar = EXCLUDED.country_label_ar,
             category_label_ar = EXCLUDED.category_label_ar,
             visitors_text = EXCLUDED.visitors_text,
             rating = EXCLUDED.rating,
             cta_label_ar = EXCLUDED.cta_label_ar,
             is_featured = EXCLUDED.is_featured,
             display_order = EXCLUDED.display_order`,
          [
            d.slug,
            d.name_ar,
            d.name_en,
            d.description_ar,
            d.tags_ar,
            d.image_url,
            d.country_label_ar,
            d.category_label_ar,
            d.visitors_text,
            d.rating,
            d.cta_label_ar,
            d.is_featured,
            d.display_order,
            d.lat,
            d.lng,
          ]
        );
      }
    }

    destinationsSchemaEnsured = true;
  }

  async function ensureSeedData(preferredAdminId = null) {
    if (seedPromise) return seedPromise;
    seedPromise = (async () => {
      try {
        await ensureDestinationsRichSchema(pool);
        const countRes = await pool.query(`SELECT count(*)::int AS cnt FROM travora.providers`);
        if (countRes.rows[0].cnt > 0) {
          await resolveAdminReviewerId(pool, preferredAdminId);
          await ensureDemoCredentials(pool);
          return { seeded: false };
        }

        const client = await pool.connect();
        try {
          await client.query('BEGIN');

          // 0. Ensure Currencies & Countries exist
          await client.query(`
            INSERT INTO travora.currencies (code, name_ar, name_en, symbol, minor_units)
            VALUES
              ('EGP', 'جنيه مصري', 'Egyptian Pound', 'ج.م', 2),
              ('USD', 'دولار أمريكي', 'US Dollar', '$', 2),
              ('EUR', 'يورو', 'Euro', '€', 2),
              ('SAR', 'ريال سعودي', 'Saudi Riyal', 'ر.س', 2)
            ON CONFLICT (code) DO NOTHING
          `);

          await client.query(`
            INSERT INTO travora.countries (code, name_ar, name_en, default_currency)
            VALUES
              ('EG', 'جمهورية مصر العربية', 'Egypt', 'EGP'),
              ('SA', 'المملكة العربية السعودية', 'Saudi Arabia', 'SAR'),
              ('AE', 'الإمارات العربية المتحدة', 'United Arab Emirates', 'USD')
            ON CONFLICT (code) DO NOTHING
          `);

          // 1. Ensure Admin User & Demo Users
          const adminId = await resolveAdminReviewerId(client, preferredAdminId);

          const demoUsersSpec = [
            { email: 'nile.palace@travora.eg', name: 'مجموعة قصر النيل للفنادق', phone: '+201011112201', role: 'provider', status: 'active' },
            { email: 'redsea.adventures@travora.eg', name: 'مغامرات البحر الأحمر السياحية', phone: '+201011112202', role: 'provider', status: 'active' },
            { email: 'cairo.vip.fleet@travora.eg', name: 'أسطول القاهرة لكبار الشخصيات', phone: '+201011112203', role: 'provider', status: 'active' },
            { email: 'elgouna.dining@travora.eg', name: 'مطاعم الجونة الفاخرة', phone: '+201011112204', role: 'provider', status: 'active' },
            { email: 'luxor.guides@travora.eg', name: 'دليل الأقصر الملكي', phone: '+201011112205', role: 'provider', status: 'active' },
            { email: 'siwa.oasis.resort@travora.eg', name: 'منتجع واحة سيوة البيئي', phone: '+201011112206', role: 'provider', status: 'active' },
            { email: 'aswan.nubian.cruises@travora.eg', name: 'ذهبيات أسوان النوبية', phone: '+201011112207', role: 'provider', status: 'active' },
            { email: 'ahmed.mansour@example.com', name: 'أحمد منصور', phone: '+201099887711', role: 'traveler', status: 'active' },
            { email: 'sara.alkhalil@example.com', name: 'سارة الخليل', phone: '+201099887722', role: 'traveler', status: 'active' },
            { email: 'omar.hassan@example.com', name: 'عمر حسن الشافعي', phone: '+201099887733', role: 'traveler', status: 'active' },
            { email: 'nadia.farouk@example.com', name: 'نادية فاروق', phone: '+201099887744', role: 'traveler', status: 'suspended' },
          ];

          const demoUsers = {};
          for (const u of demoUsersSpec) {
            const r = await client.query(
              `INSERT INTO travora.users (email, email_verified_at, phone_e164, phone_verified_at, display_name, country_code, role, status)
               VALUES ($1, now(), $2, now(), $3, 'EG', $4, $5)
               ON CONFLICT (email) DO UPDATE SET display_name = EXCLUDED.display_name
               RETURNING id, email, display_name`,
              [u.email, u.phone, u.name, u.role, u.status]
            );
            demoUsers[u.email] = r.rows[0];
          }

          // 2. Destinations
          const destinationsSpec = [
            { slug: 'cairo', name_ar: 'القاهرة التاريخية', name_en: 'Historic Cairo', lat: 30.0444, lng: 31.2357, desc_ar: 'قلب مصر النابض بالتاريخ والفنادق الفاخرة على ضفاف النيل.' },
            { slug: 'luxor', name_ar: 'الأقصر وملوك النيل', name_en: 'Luxor & Nile Valley', lat: 25.6872, lng: 32.6396, desc_ar: 'أعظم متحف مفتوح في العالم والرحلات النيلية الملكية.' },
            { slug: 'sharm-el-sheikh', name_ar: 'شرم الشيخ', name_en: 'Sharm El-Sheikh', lat: 27.9158, lng: 34.3300, desc_ar: 'منتجعات البحر الأحمر الفاخرة والغوص والرحلات البحرية.' },
            { slug: 'el-gouna', name_ar: 'الجونة - البحر الأحمر', name_en: 'El Gouna Lagoon', lat: 27.3942, lng: 33.6782, desc_ar: 'وجهة الجزر الفيروزية والمطاعم العالمية واليخوت الخاصة.' },
            { slug: 'aswan', name_ar: 'أسوان والنوبة', name_en: 'Aswan & Nubia', lat: 24.0889, lng: 32.8998, desc_ar: 'الطبيعة الساحرة على ضفاف النيل ومعبد فيلة العريق.' },
            { slug: 'siwa-oasis', name_ar: 'واحة سيوة', name_en: 'Siwa Oasis', lat: 29.2032, lng: 25.5195, desc_ar: 'ملاذ الهدوء والمنتجعات البيئية الفريدة وسط الصحراء الغربية.' },
          ];

          const destinations = {};
          for (const d of destinationsSpec) {
            const r = await client.query(
              `INSERT INTO travora.destinations (country_code, kind, slug, name_ar, name_en, description_ar, description_en, timezone, latitude, longitude, status)
               VALUES ('EG', 'city', $1, $2, $3, $4, $3, 'Africa/Cairo', $5, $6, 'active')
               ON CONFLICT (slug) DO UPDATE SET name_ar = EXCLUDED.name_ar
               RETURNING id, slug, name_ar`,
              [d.slug, d.name_ar, d.name_en, d.desc_ar, d.lat, d.lng]
            );
            destinations[d.slug] = r.rows[0];
          }

          // 3. Providers
          const providersSpec = [
            {
              code: 'nile-palace-hospitality',
              ownerEmail: 'nile.palace@travora.eg',
              name_ar: 'فنادق ومنتجعات قصر النيل الملكي',
              name_en: 'Nile Palace Royal Hospitality',
              legal_name: 'شركة قصر النيل للفنادق والمنشآت السياحية ش.م.م',
              kind: 'business',
              status: 'active',
              category: 'hotel',
              email: 'partners@nilepalace.eg',
              phone: '+201011112201',
              regRef: 'CR-EG-100291',
              appStatus: 'approved',
              notes: 'تم التحقق من السجل التجاري وترخيص وزارة السياحة (فئة 5 نجوم).',
            },
            {
              code: 'red-sea-royal-adventures',
              ownerEmail: 'redsea.adventures@travora.eg',
              name_ar: 'مغامرات ويخوت البحر الأحمر الملكية',
              name_en: 'Red Sea Royal Yachts & Adventures',
              legal_name: 'البحر الأحمر للرحلات البحرية والأنشطة السياحية',
              kind: 'business',
              status: 'active',
              category: 'activity',
              email: 'ops@redsearoyal.eg',
              phone: '+201011112202',
              regRef: 'CR-EG-200482',
              appStatus: 'approved',
              notes: 'تم اعتماد تراخيص اليخوت البحرية وشهادات السلامة.',
            },
            {
              code: 'cairo-vip-limo',
              ownerEmail: 'cairo.vip.fleet@travora.eg',
              name_ar: 'أسطول ترافورا للنقل الفاخر VIP',
              name_en: 'Travora VIP Chauffeur Fleet',
              legal_name: 'الشركة المصرية لخدمات الليموزين والنقل السياحي',
              kind: 'business',
              status: 'active',
              category: 'transport',
              email: 'fleet@cairovip.eg',
              phone: '+201011112203',
              regRef: 'CR-EG-300891',
              appStatus: 'approved',
              notes: 'أسطول سيارات مرسيدس وفان سياحي مرخص بالكامل.',
            },
            {
              code: 'elgouna-fine-dining',
              ownerEmail: 'elgouna.dining@travora.eg',
              name_ar: 'لا ميزون دي لاغون - الجونة',
              name_en: 'La Maison du Lagon El Gouna',
              legal_name: 'شركة الجونة للضيافة والمطاعم الفاخرة',
              kind: 'business',
              status: 'active',
              category: 'restaurant',
              email: 'reservations@lamaison-gouna.eg',
              phone: '+201011112204',
              regRef: 'CR-EG-400112',
              appStatus: 'approved',
              notes: 'تم التحقق من شهادات الجودة والسلامة الغذائية.',
            },
            {
              code: 'luxor-royal-guides',
              ownerEmail: 'luxor.guides@travora.eg',
              name_ar: 'د. طارق زكي — مرشد الآثار المصرية الملكي',
              name_en: 'Dr. Tarek Zaki — Royal Egyptologist Guide',
              legal_name: 'طارق زكي عبد الرحمن (مرشد سياحي مرخص)',
              kind: 'individual',
              status: 'active',
              category: 'guide',
              email: 'tarek.guide@travora.eg',
              phone: '+201011112205',
              regRef: 'LIC-GUIDE-8841',
              appStatus: 'approved',
              notes: 'ترخيص نقابة المرشدين السياحيين ساري (لغات: العربية، الإنجليزية، الفرنسية).',
            },
            {
              code: 'siwa-eco-lodge',
              ownerEmail: 'siwa.oasis.resort@travora.eg',
              name_ar: 'منتجع أدرير أميلال البيئي - سيوة',
              name_en: 'Siwa Royal Desert Eco-Lodge',
              legal_name: 'واحة سيوة للسياحة البيئية والفنادق التراثية',
              kind: 'business',
              status: 'pending',
              category: 'hotel',
              email: 'apply@siwaecolodge.eg',
              phone: '+201011112206',
              regRef: 'CR-EG-500912',
              appStatus: 'submitted',
              notes: null,
            },
            {
              code: 'aswan-nubian-dahabiya',
              ownerEmail: 'aswan.nubian.cruises@travora.eg',
              name_ar: 'ذهبيات نفرتاري النيلية الفاخرة',
              name_en: 'Nefertari Luxury Nile Dahabiya',
              legal_name: 'شركة نفرتاري للرحلات النيلية والذهبيات السياحية',
              kind: 'business',
              status: 'pending',
              category: 'activity',
              email: 'info@nefertaricruises.eg',
              phone: '+201011112207',
              regRef: 'CR-EG-600774',
              appStatus: 'in_review',
              notes: 'يرجى إرفاق شهادة تجديد الملاحة النهرية لعام 2026 الخاصة بالذهبية الثانية.',
            },
          ];

          const providers = {};
          for (const p of providersSpec) {
            const ownerId = demoUsers[p.ownerEmail].id;
            const pr = await client.query(
              `INSERT INTO travora.providers (code, owner_user_id, name_ar, name_en, legal_name, organization_kind, country_code, contact_email, phone_e164, status)
               VALUES ($1, $2, $3, $4, $5, $6, 'EG', $7, $8, $9)
               ON CONFLICT (code) DO UPDATE SET name_ar = EXCLUDED.name_ar
               RETURNING id, code, name_ar, status`,
              [p.code, ownerId, p.name_ar, p.name_en, p.legal_name, p.kind, p.email, p.phone, p.status]
            );
            const providerRow = pr.rows[0];
            providers[p.code] = providerRow;

            await client.query(
              `INSERT INTO travora.provider_category_assignments (provider_id, category_code)
               VALUES ($1, $2)
               ON CONFLICT (provider_id, category_code) DO NOTHING`,
              [providerRow.id, p.category]
            );

            // Create branch
            await client.query(
              `INSERT INTO travora.provider_branches (provider_id, destination_id, country_code, code, name_ar, name_en, address_ar, address_en, timezone, status)
               VALUES ($1, $2, 'EG', 'hq', $3, $4, 'المقر الرئيسي - مصر', 'Main Headquarters - Egypt', 'Africa/Cairo', 'active')
               ON CONFLICT (provider_id, code) DO NOTHING`,
              [providerRow.id, destinations['cairo'].id, `${p.name_ar} - المقر الرئيسي`, `${p.name_en} HQ`]
            );

            // Create payout destination for active providers
            if (p.status === 'active') {
              await client.query(
                `INSERT INTO travora.provider_payout_destinations (provider_id, currency, processor, processor_account_ref, display_label, account_last4, created_by_user_id, status, verified_at)
                 VALUES ($1, 'EGP', 'paymob_payouts', $2, $3, $4, $5, 'active', now())
                 ON CONFLICT (processor, processor_account_ref, currency) DO NOTHING`,
                [
                  providerRow.id,
                  `acct_eg_${p.code}`,
                  `حساب البنك التجاري الدولي CIB - ${p.name_ar}`,
                  String(1000 + Math.floor(Math.random() * 8999)),
                  ownerId,
                ]
              );
            }

            // Create provider application (note: business_provider_owner_insert trigger already created owner membership!)
            const isDecided = p.appStatus === 'approved' || p.appStatus === 'rejected';
            await client.query(
              `INSERT INTO travora.provider_applications
                 (provider_id, applicant_user_id, legal_name, country_code, registration_reference, status, submitted_at, reviewed_by_user_id, reviewed_at, decision_notes)
               VALUES ($1, $2, $3, 'EG', $4, $5, now() - interval '4 days', $6, $7, $8)`,
              [
                providerRow.id,
                ownerId,
                p.legal_name,
                p.regRef,
                p.appStatus,
                isDecided ? adminId : null,
                isDecided ? new Date() : null,
                p.notes,
              ]
            );

            // Audit event
            await client.query(
              `INSERT INTO travora.provider_audit_events (provider_id, actor_user_id, action, entity_type, entity_id, summary)
               VALUES ($1, $2, $3, 'provider', $1, $4)`,
              [
                providerRow.id,
                adminId,
                isDecided ? 'provider.application.approved' : 'provider.application.submitted',
                isDecided
                  ? `تم اعتماد شريك الخدمة (${p.name_ar}) وتفعيل الحساب في المنصة.`
                  : `تم استلام طلب انضمام جديد من (${p.name_ar}) للمراجعة.`,
              ]
            );
          }

          // 4. Catalog Services (Hotels, Activities, Transport, Restaurants, Guides)
          const hotelRes = await client.query(
            `INSERT INTO travora.hotels (destination_id, provider_id, slug, name_ar, name_en, description_ar, description_en, address_ar, address_en, star_rating, latitude, longitude, cancellation_hours, status)
             VALUES ($1, $2, 'st-regis-nile-palace-cairo', 'فندق سانت ريجيس قصر النيل - القاهرة', 'St. Regis Nile Palace Cairo', 'إقامة ملكية فاخرة تطل مباشرة على نهر النيل في قلب القاهرة.', 'Luxury royal stay overlooking the Nile in Cairo.', 'كورنيش النيل، القاهرة', 'Nile Corniche, Cairo', 5, 30.0626, 31.2262, 24, 'active')
             ON CONFLICT (slug) DO UPDATE SET name_ar = EXCLUDED.name_ar
             RETURNING id`,
            [destinations['cairo'].id, providers['nile-palace-hospitality'].id]
          );
          const hotelId = hotelRes.rows[0].id;

          await client.query(
            `INSERT INTO travora.hotels (destination_id, provider_id, slug, name_ar, name_en, description_ar, description_en, address_ar, address_en, star_rating, latitude, longitude, cancellation_hours, status)
             VALUES ($1, $2, 'winter-palace-luxor-royal', 'قصر وينتر بالاس الملكي - الأقصر', 'Royal Winter Palace Luxor', 'تحفة تاريخية على ضفاف النيل بجوار معبد الأقصر.', 'Historic palace overlooking the Nile and Luxor Temple.', 'كورنيش النيل، الأقصر', 'Corniche El Nil, Luxor', 5, 25.6967, 32.6378, 48, 'active')
             ON CONFLICT (slug) DO NOTHING`,
            [destinations['luxor'].id, providers['nile-palace-hospitality'].id]
          );

          const roomTypeRes = await client.query(
            `INSERT INTO travora.room_types (hotel_id, code, name_ar, name_en, description_ar, description_en, max_adults, max_children, max_occupancy, area_sqm, bed_description_ar, bed_description_en, status)
             VALUES ($1, 'royal-nile-suite', 'الجناح الملكي المطل على النيل', 'Royal Nile View Suite', 'جناح فاخر مع شرفة بانورامية وخدمة كبير الخدم الشخصي.', 'Luxury suite with panoramic Nile balcony and butler service.', 3, 2, 4, 85.0, 'سرير كينج ملكي + أريكة فاخرة', 'Royal King Bed', 'active')
             ON CONFLICT (hotel_id, code) DO UPDATE SET name_ar = EXCLUDED.name_ar
             RETURNING id`,
            [hotelId]
          );
          const roomTypeId = roomTypeRes.rows[0].id;

          for (let d = 0; d < 10; d++) {
            await client.query(
              `INSERT INTO travora.room_inventory (room_type_id, inventory_date, total_units, price_minor, currency, is_closed)
               VALUES ($1, current_date + $2::int, 10, 950000, 'EGP', false)
               ON CONFLICT (room_type_id, inventory_date) DO NOTHING`,
              [roomTypeId, d]
            );
          }

          // Activity
          const actRes = await client.query(
            `INSERT INTO travora.activities (destination_id, provider_id, slug, name_ar, name_en, description_ar, description_en, category, pricing_model, duration_minutes, minimum_age, meeting_point_ar, meeting_point_en, latitude, longitude, cancellation_hours, status)
             VALUES ($1, $2, 'red-sea-royal-yacht-cruise', 'رحلة يخت ملكي خاص في جزيرة تيران - شرم الشيخ', 'Private Royal Yacht Cruise - Tiran Island', 'يوم كامل على متن يخت فاخر مع غداء مأكولات بحرية وغوص مرجاني.', 'Full day luxury yacht excursion with seafood dining and snorkeling.', 'adventure', 'per_person', 420, 6, 'مرسى شرم الشيخ الدولي لليخوت', 'Sharm International Marina', 27.9158, 34.3300, 24, 'active')
             ON CONFLICT (slug) DO UPDATE SET name_ar = EXCLUDED.name_ar
             RETURNING id`,
            [destinations['sharm-el-sheikh'].id, providers['red-sea-royal-adventures'].id]
          );
          const activityId = actRes.rows[0].id;

          const actSessionStart = new Date(Date.now() + 3 * 86400000);
          actSessionStart.setUTCHours(9, 0, 0, 0);
          const actSessionEnd = new Date(actSessionStart.getTime() + 7 * 3600000);

          const actSessionRes = await client.query(
            `INSERT INTO travora.activity_sessions (activity_id, starts_at, ends_at, capacity, price_minor, currency, status)
             VALUES ($1, $2, $3, 20, 320000, 'EGP', 'scheduled')
             RETURNING id, starts_at, ends_at, price_minor`,
            [activityId, actSessionStart, actSessionEnd]
          );
          const actSession = actSessionRes.rows[0];

          // Transport Service
          const transRes = await client.query(
            `INSERT INTO travora.transport_services (destination_id, provider_id, origin_destination_id, slug, name_ar, name_en, description_ar, description_en, service_type, pricing_model, seats, luggage_capacity, duration_minutes, price_minor, currency, cancellation_hours, status)
             VALUES ($1, $2, $1, 'cairo-airport-mercedes-s-class', 'استقبال مطار القاهرة الدولي - مرسيدس S-Class VIP', 'Cairo Airport VIP Chauffeur - Mercedes S-Class', 'استقبال خاص من صالة كبار الزوار بمطار القاهرة إلى الفندق.', 'VIP Meet & Assist and Mercedes S-Class transfer.', 'airport_transfer', 'per_vehicle', 3, 4, 60, 250000, 'EGP', 12, 'active')
             ON CONFLICT (slug) DO UPDATE SET name_ar = EXCLUDED.name_ar
             RETURNING id`,
            [destinations['cairo'].id, providers['cairo-vip-limo'].id]
          );
          const transportServiceId = transRes.rows[0].id;

          const transDep = new Date(Date.now() + 2 * 86400000);
          transDep.setUTCHours(14, 0, 0, 0);
          const transArr = new Date(transDep.getTime() + 3600000);

          const transOfferRes = await client.query(
            `INSERT INTO travora.transport_offers (transport_service_id, departure_at, arrival_at, capacity, price_minor, currency, status)
             VALUES ($1, $2, $3, 5, 250000, 'EGP', 'scheduled')
             RETURNING id, departure_at, price_minor`,
            [transportServiceId, transDep, transArr]
          );
          const transOffer = transOfferRes.rows[0];

          // Restaurant
          await client.query(
            `INSERT INTO travora.restaurants (destination_id, provider_id, slug, name_ar, name_en, description_ar, description_en, cuisine_ar, cuisine_en, address_ar, address_en, timezone, latitude, longitude, currency, cancellation_hours, status)
             VALUES ($1, $2, 'la-maison-du-lagon-el-gouna', 'مطعم لا ميزون دي لاغون - الجونة', 'La Maison du Lagon Fine Dining', 'تجربة عشاء فاخرة على البحيرة الفيروزية مباشرة.', 'Fine dining on the El Gouna turquoise lagoon.', 'فرنسي وبحري فاخر', 'French & Seafood', 'مارينا أبو تيج، الجونة', 'Abu Tig Marina, El Gouna', 'Africa/Cairo', 27.3942, 33.6782, 'EGP', 12, 'active')
             ON CONFLICT (slug) DO NOTHING`,
            [destinations['el-gouna'].id, providers['elgouna-fine-dining'].id]
          );

          // Guide Profile
          await client.query(
            `INSERT INTO travora.guide_profiles (provider_id, destination_id, slug, name_ar, name_en, bio_ar, bio_en, license_reference, currency, cancellation_hours, status)
             VALUES ($1, $2, 'dr-tarek-zaki-luxor-guide', 'د. طارق زكي — خبير الآثار المصرية والملكية', 'Dr. Tarek Zaki — Senior Royal Egyptologist', 'دكتوراه في علم المصريات وخبرة 15 عاماً في الجولات الملكية الخاصة في معابد الكرنك ووادي الملوك.', 'PhD in Egyptology with 15 years leading private VIP tours in Luxor.', 'EG-GUIDE-LUX-8841', 'EGP', 24, 'active')
             ON CONFLICT (slug) DO NOTHING`,
            [providers['luxor-royal-guides'].id, destinations['luxor'].id]
          );

          // 5. Commission Rules (6 booking kinds)
          const rulesSpec = [
            { kind: 'HOTEL', name: 'عمولة الفنادق والمنتجعات الفاخرة (12%)', rate_bps: 1200, providerId: null },
            { kind: 'ACTIVITY', name: 'عمولة الأنشطة والرحلات البحرية (15%)', rate_bps: 1500, providerId: null },
            { kind: 'TRANSPORT', name: 'عمولة النقل الفاخر والليموزين (10%)', rate_bps: 1000, providerId: null },
            { kind: 'RESTAURANT', name: 'عمولة حجوزات المطاعم الراقية (8%)', rate_bps: 800, providerId: null },
            { kind: 'GUIDE', name: 'عمولة المرشدين السياحيين الخاصين (12.5%)', rate_bps: 1250, providerId: null },
            { kind: 'DELIVERY', name: 'عمولة توصيل الطلبات الفاخرة (14%)', rate_bps: 1400, providerId: null },
          ];

          const commissionRulesByKind = {};
          for (const rule of rulesSpec) {
            const rr = await client.query(
              `INSERT INTO travora.commission_rules (provider_id, currency, booking_kind, name, rate_bps, effective_from, is_active)
               VALUES ($1, 'EGP', $2, $3, $4, now() - interval '30 days', true)
               RETURNING id, booking_kind, rate_bps`,
              [rule.providerId, rule.kind, rule.name, rule.rate_bps]
            );
            commissionRulesByKind[rule.kind] = rr.rows[0];
          }

          // 6. Seed Real Bookings (satisfying validate_booking_complete & assert_booking_provider_snapshot)
          const traveler1 = demoUsers['ahmed.mansour@example.com'];
          const traveler2 = demoUsers['sara.alkhalil@example.com'];
          const traveler3 = demoUsers['omar.hassan@example.com'];

          // Booking 1: HOTEL (2 nights * 950,000 = 1,900,000 minor = 19,000 EGP)
          const b1Subtotal = 1900000;
          const b1Tax = 266000;
          const b1Fee = 50000;
          const b1Total = b1Subtotal + b1Tax + b1Fee;
          const b1Res = await client.query(
            `INSERT INTO travora.bookings
               (reference, user_id, kind, status, payment_terms, currency, subtotal_minor, tax_minor, fee_minor, discount_minor, service_title_snapshot, contact_name, contact_email, contact_phone, hold_expires_at)
             VALUES ('TRV-2026-1001', $1, 'HOTEL', 'pending_payment', 'prepaid', 'EGP', $2, $3, $4, 0, 'فندق سانت ريجيس قصر النيل - الجناح الملكي (ليلتان)', $5, $6, '+201099887711', now() + interval '2 days')
             RETURNING id`,
            [traveler1.id, b1Subtotal, b1Tax, b1Fee, traveler1.display_name, traveler1.email]
          );
          const b1Id = b1Res.rows[0].id;

          await client.query(
            `INSERT INTO travora.hotel_booking_details
               (booking_id, hotel_id, room_type_id, check_in, check_out, room_count, adult_count, child_count, room_name_snapshot, meal_plan_snapshot)
             VALUES ($1, $2, $3, current_date + 1, current_date + 3, 1, 2, 0, 'الجناح الملكي المطل على النيل', 'إفطار ملكي فاخر')`,
            [b1Id, hotelId, roomTypeId]
          );

          await client.query(
            `INSERT INTO travora.room_night_allocations (booking_id, room_type_id, inventory_date, currency, units, unit_price_minor, state)
             VALUES ($1, $2, current_date + 1, 'EGP', 1, 950000, 'held'),
                    ($1, $2, current_date + 2, 'EGP', 1, 950000, 'held')`,
            [b1Id, roomTypeId]
          );

          const pay1Res = await client.query(
            `INSERT INTO travora.payment_attempts (booking_id, currency, method, provider, idempotency_key, provider_payment_id, status, amount_minor)
             VALUES ($1, 'EGP', 'card', 'paymob', 'idem-trv-1001', 'pay_eg_1001', 'succeeded', $2)
             RETURNING id`,
            [b1Id, b1Total]
          );
          const pay1Id = pay1Res.rows[0].id;

          await client.query(`UPDATE travora.bookings SET status = 'confirmed' WHERE id = $1`, [b1Id]);
          await client.query(
            `INSERT INTO travora.booking_commissions (booking_id, provider_id, currency, commission_rule_id, rate_bps)
             VALUES ($1, $2, 'EGP', $3, $4)`,
            [b1Id, providers['nile-palace-hospitality'].id, commissionRulesByKind['HOTEL'].id, commissionRulesByKind['HOTEL'].rate_bps]
          );

          // Booking 2: ACTIVITY (2 participants * 320,000 = 640,000 minor = 6,400 EGP) -> completed
          const b2Subtotal = 640000;
          const b2Tax = 89600;
          const b2Fee = 20000;
          const b2Total = b2Subtotal + b2Tax + b2Fee;
          const b2Res = await client.query(
            `INSERT INTO travora.bookings
               (reference, user_id, kind, status, payment_terms, currency, subtotal_minor, tax_minor, fee_minor, discount_minor, service_title_snapshot, contact_name, contact_email, contact_phone, hold_expires_at)
             VALUES ('TRV-2026-1002', $1, 'ACTIVITY', 'pending_payment', 'prepaid', 'EGP', $2, $3, $4, 0, 'رحلة يخت ملكي خاص في جزيرة تيران - شرم الشيخ', $5, $6, '+201099887722', now() + interval '2 days')
             RETURNING id`,
            [traveler2.id, b2Subtotal, b2Tax, b2Fee, traveler2.display_name, traveler2.email]
          );
          const b2Id = b2Res.rows[0].id;

          await client.query(
            `INSERT INTO travora.activity_booking_details
               (booking_id, activity_id, session_id, participant_count, unit_price_minor, service_starts_at_snapshot, service_ends_at_snapshot)
             VALUES ($1, $2, $3, 2, $4, $5, $6)`,
            [b2Id, activityId, actSession.id, actSession.price_minor, actSession.starts_at, actSession.ends_at]
          );

          await client.query(
            `INSERT INTO travora.activity_allocations (booking_id, session_id, currency, units, state)
             VALUES ($1, $2, 'EGP', 2, 'held')`,
            [b2Id, actSession.id]
          );

          const pay2Res = await client.query(
            `INSERT INTO travora.payment_attempts (booking_id, currency, method, provider, idempotency_key, provider_payment_id, status, amount_minor)
             VALUES ($1, 'EGP', 'card', 'paymob', 'idem-trv-1002', 'pay_eg_1002', 'succeeded', $2)
             RETURNING id`,
            [b2Id, b2Total]
          );
          const pay2Id = pay2Res.rows[0].id;

          await client.query(`UPDATE travora.bookings SET status = 'confirmed' WHERE id = $1`, [b2Id]);
          await client.query(`UPDATE travora.bookings SET status = 'completed' WHERE id = $1`, [b2Id]);
          await client.query(
            `INSERT INTO travora.booking_commissions (booking_id, provider_id, currency, commission_rule_id, rate_bps)
             VALUES ($1, $2, 'EGP', $3, $4)`,
            [b2Id, providers['red-sea-royal-adventures'].id, commissionRulesByKind['ACTIVITY'].id, commissionRulesByKind['ACTIVITY'].rate_bps]
          );

          // Booking 3: TRANSPORT (1 vehicle * 250,000 = 2,500 EGP) -> pending_payment
          const b3Subtotal = 250000;
          const b3Tax = 35000;
          const b3Fee = 10000;
          const b3Res = await client.query(
            `INSERT INTO travora.bookings
               (reference, user_id, kind, status, payment_terms, currency, subtotal_minor, tax_minor, fee_minor, discount_minor, service_title_snapshot, contact_name, contact_email, contact_phone, hold_expires_at)
             VALUES ('TRV-2026-1003', $1, 'TRANSPORT', 'pending_payment', 'prepaid', 'EGP', $2, $3, $4, 0, 'استقبال مطار القاهرة الدولي - مرسيدس S-Class VIP', $5, $6, '+201099887733', now() + interval '1 day')
             RETURNING id`,
            [traveler3.id, b3Subtotal, b3Tax, b3Fee, traveler3.display_name, traveler3.email]
          );
          const b3Id = b3Res.rows[0].id;

          await client.query(
            `INSERT INTO travora.transport_booking_details
               (booking_id, transport_service_id, offer_id, passenger_count, luggage_count, unit_price_minor, pickup_label, dropoff_label, pickup_at_snapshot)
             VALUES ($1, $2, $3, 2, 2, $4, 'مطار القاهرة الدولي - صالة كبار الزوار', 'فندق سانت ريجيس قصر النيل', $5)`,
            [b3Id, transportServiceId, transOffer.id, transOffer.price_minor, transOffer.departure_at]
          );

          await client.query(
            `INSERT INTO travora.transport_allocations (booking_id, offer_id, currency, units, state)
             VALUES ($1, $2, 'EGP', 1, 'held')`,
            [b3Id, transOffer.id]
          );

          await client.query(
            `INSERT INTO travora.booking_commissions (booking_id, provider_id, currency, commission_rule_id, rate_bps)
             VALUES ($1, $2, 'EGP', $3, $4)`,
            [b3Id, providers['cairo-vip-limo'].id, commissionRulesByKind['TRANSPORT'].id, commissionRulesByKind['TRANSPORT'].rate_bps]
          );

          // 7. Provider Settlements, Settlement Items & Payouts
          const set1Res = await client.query(
            `INSERT INTO travora.provider_settlements (provider_id, currency, period_start, period_end, status)
             VALUES ($1, 'EGP', now() - interval '14 days', now() + interval '1 day', 'draft')
             RETURNING id`,
            [providers['nile-palace-hospitality'].id]
          );
          const set1Id = set1Res.rows[0].id;

          await client.query(
            `INSERT INTO travora.settlement_items (settlement_id, provider_id, currency, booking_id, entry_type, payment_attempt_id, gross_minor, commission_minor, occurred_at)
             VALUES ($1, $2, 'EGP', $3, 'capture', $4, 100, 10, now())`,
            [set1Id, providers['nile-palace-hospitality'].id, b1Id, pay1Id]
          );

          await client.query(`UPDATE travora.provider_settlements SET status = 'approved' WHERE id = $1`, [set1Id]);

          const dest1Res = await client.query(
            `SELECT id FROM travora.provider_payout_destinations WHERE provider_id = $1 LIMIT 1`,
            [providers['nile-palace-hospitality'].id]
          );
          if (dest1Res.rows[0]) {
            const payout1Res = await client.query(
              `INSERT INTO travora.provider_payouts (settlement_id, provider_id, currency, payout_destination_id, processor, idempotency_key, amount_minor, status)
               VALUES ($1, $2, 'EGP', $3, 'paymob_payouts', 'payout-idem-1001', 1500000, 'pending')
               RETURNING id`,
              [set1Id, providers['nile-palace-hospitality'].id, dest1Res.rows[0].id]
            );
            await client.query(
              `UPDATE travora.provider_payouts SET status = 'succeeded', processor_payout_ref = 'PYT-CIB-2026-9901' WHERE id = $1`,
              [payout1Res.rows[0].id]
            );
          }

          // Settlement 2: Red Sea Royal Adventures (Draft / Ready for Admin Approval)
          const set2Res = await client.query(
            `INSERT INTO travora.provider_settlements (provider_id, currency, period_start, period_end, status)
             VALUES ($1, 'EGP', now() - interval '7 days', now() + interval '7 days', 'draft')
             RETURNING id`,
            [providers['red-sea-royal-adventures'].id]
          );
          const set2Id = set2Res.rows[0].id;

          await client.query(
            `INSERT INTO travora.settlement_items (settlement_id, provider_id, currency, booking_id, entry_type, payment_attempt_id, gross_minor, commission_minor, occurred_at)
             VALUES ($1, $2, 'EGP', $3, 'capture', $4, 100, 10, now())`,
            [set2Id, providers['red-sea-royal-adventures'].id, b2Id, pay2Id]
          );

          // 8. Support Tickets / Disputes
          const t1Res = await client.query(
            `INSERT INTO travora.support_tickets (user_id, booking_id, assigned_to_user_id, subject, category, status, priority)
             VALUES ($1, $2, $3, 'طلب تعديل موعد الوصول للجناح الملكي وإضافة استقبال مطار', 'BOOKING', 'OPEN', 'HIGH')
             RETURNING id`,
            [traveler1.id, b1Id, adminId]
          );
          await client.query(
            `INSERT INTO travora.support_messages (ticket_id, ticket_user_id, author_user_id, sender_role, body)
             VALUES ($1, $2, $2, 'CUSTOMER', 'مرحباً فريق ترافورا، أرغب في تقديم موعد تسجيل الدخول إلى الساعة 11 صباحاً مع تأكيد خدمة كبير الخدم.')`,
            [t1Res.rows[0].id, traveler1.id]
          );

          const t2Res = await client.query(
            `INSERT INTO travora.support_tickets (user_id, booking_id, assigned_to_user_id, subject, category, status, priority)
             VALUES ($1, $2, $3, 'استفسار حول استرداد فرق رسوم المرافق الإضافية في رحلة اليخت', 'PAYMENT', 'WAITING_AGENT', 'URGENT')
             RETURNING id`,
            [traveler2.id, b2Id, adminId]
          );
          await client.query(
            `INSERT INTO travora.support_messages (ticket_id, ticket_user_id, author_user_id, sender_role, body)
             VALUES ($1, $2, $2, 'CUSTOMER', 'تم خصم مبلغ إضافي لمعدات الغوص رغم أنها مشمولة في الباقة الملكية، أرجو المراجعة.')`,
            [t2Res.rows[0].id, traveler2.id]
          );

          const t3Res = await client.query(
            `INSERT INTO travora.support_tickets (user_id, booking_id, assigned_to_user_id, subject, category, status, priority, resolved_at)
             VALUES ($1, $2, $3, 'تأكيد موقع الالتقاء لسيارة المرسيدس في صالة كبار الزوار', 'TRIP', 'RESOLVED', 'NORMAL', now())
             RETURNING id`,
            [traveler3.id, b3Id, adminId]
          );
          await client.query(
            `INSERT INTO travora.support_messages (ticket_id, ticket_user_id, author_user_id, sender_role, body)
             VALUES ($1, $2, $3, 'AGENT', 'تم التواصل مع قائد الأسطول وإرسال بيانات السائق ورقم اللوحة إلى بريدكم الإلكتروني والواتساب.')`,
            [t3Res.rows[0].id, traveler3.id, adminId]
          );

          // 9. Content Pages & FAQs
          await client.query(
            `INSERT INTO travora.content_pages (slug, locale, title, body_markdown, publication_status, authored_by_user_id, published_at)
             VALUES
               ('cancellation-policy', 'ar', 'سياسة الإلغاء والاسترداد الفاخرة', 'تضمن منصة ترافورا استرداداً كاملاً خلال فترة السماح المحددة لكل خدمة سياحية فاخرة.', 'PUBLISHED', $1, now()),
               ('partner-charter', 'ar', 'ميثاق جودة شركاء ترافورا', 'يلتزم جميع مقدمي الخدمات في منصة ترافورا بمعايير الضيافة الملكية المعتمدة.', 'PUBLISHED', $1, now())
             ON CONFLICT (slug, locale) DO NOTHING`,
            [adminId]
          );

          await client.query(
            `INSERT INTO travora.faq_entries (locale, category, question, answer_markdown, sort_order, is_published)
             VALUES
               ('ar', 'BOOKING', 'كيف يعمل مخطط الرحلات الذكي بالذكاء الاصطناعي؟', 'يقوم محرك الذكاء الاصطناعي في ترافورا بتحليل تفضيلاتك وميزانيتك لبناء مسار يومي متكامل قابل للحجز بضغطة واحدة.', 1, true),
               ('ar', 'PAYMENT', 'متى يتم تحويل مستحقات شركاء الخدمة بعد انتهاء الحجز؟', 'يتم إصدار التسوية المالية تلقائياً واعتمادها من الإدارة لتحويل صافي المستحقات إلى الحساب البنكي الموثق للشريك.', 2, true)
             ON CONFLICT (locale, question) DO NOTHING`
          );

          await client.query('COMMIT');
          await ensureDemoCredentials(pool);
          return { seeded: true };
        } catch (err) {
          await client.query('ROLLBACK');
          console.error('[adminService.ensureSeedData] Seed error:', err.message);
          throw err;
        } finally {
          client.release();
        }
      } finally {
        seedPromise = null;
      }
    })();
    return seedPromise;
  }

  return {
    resolveAdminReviewerId,
    ensureDestinationsRichSchema,
    ensureDemoCredentials,
    ensureSeedData,
  };
}

module.exports = createAdminSeedService;
