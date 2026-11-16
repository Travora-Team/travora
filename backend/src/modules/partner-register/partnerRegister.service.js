const crypto = require('crypto');
const ApiError = require('../../shared/utils/ApiError');
const { hashPassword } = require('../../shared/utils/password');
const { slugify } = require('../../shared/utils/slugify');
const createHotelProviderService = require('../../providers/hotels/hotel.service');
const createRestaurantProviderService = require('../../providers/restaurants/restaurant.service');
const createGuideProviderService = require('../../providers/guides/guide.service');
const createTransportProviderService = require('../../providers/transport/transport.service');

function createPartnerRegisterService(pool, { ensureSeedData } = {}) {
  const hotelService = createHotelProviderService(pool);
  const restaurantService = createRestaurantProviderService(pool);
  const guideService = createGuideProviderService(pool);
  const transportService = createTransportProviderService(pool);

  async function submitPublicPartnerApplication(payload = {}) {
    if (ensureSeedData) {
      await ensureSeedData();
    }

    const {
      partnerType = 'hotel',
      transportSubtype = null,
      publicNameAr,
      publicNameEn,
      legalName,
      applicantName,
      email,
      phone,
      password,
      citySlug = 'cairo',
      registrationReference,
      details = {},
    } = payload;

    const validTypes = ['hotel', 'restaurant', 'guide', 'transport'];
    if (!validTypes.includes(partnerType)) {
      throw new ApiError(400, 'INVALID_PARTNER_TYPE', 'يرجى اختيار نوع شريك الخدمة بشكل صحيح.');
    }

    if (!publicNameAr || !String(publicNameAr).trim()) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'يرجى إدخال اسم المنشأة أو الخدمة بالعربية.');
    }
    if (!applicantName || !String(applicantName).trim()) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'يرجى إدخال اسم المسؤول أو مقدم الطلب.');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'يرجى إدخال بريد إلكتروني صحيح للتواصل.');
    }

    const cleanNameAr = String(publicNameAr).trim();
    const cleanNameEn = String(publicNameEn || publicNameAr).trim();
    const cleanLegalName = String(legalName || publicNameAr).trim();
    const cleanApplicantName = String(applicantName).trim();
    const cleanEmail = String(email).trim().toLowerCase();

    let cleanPhone = String(phone || '').trim().replace(/\s+/g, '');
    if (cleanPhone.startsWith('01') && cleanPhone.length === 11) {
      cleanPhone = `+2${cleanPhone}`;
    } else if (cleanPhone.startsWith('201') && cleanPhone.length === 12) {
      cleanPhone = `+${cleanPhone}`;
    } else if (!/^\+[1-9][0-9]{7,14}$/.test(cleanPhone)) {
      cleanPhone = `+2010${Math.floor(10000000 + Math.random() * 89999999)}`;
    }

    const organizationKind =
      partnerType === 'guide' || (partnerType === 'transport' && transportSubtype === 'car_owner')
        ? 'individual'
        : 'business';

    const regRef =
      registrationReference && String(registrationReference).trim()
        ? String(registrationReference).trim()
        : `${partnerType === 'guide' ? 'LIC-GUIDE' : 'CR-EG'}-${Math.floor(100000 + Math.random() * 899999)}`;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Resolve or create applicant user
      const existingUserRes = await client.query(
        `SELECT id, role FROM travora.users WHERE lower(email) = $1 LIMIT 1`,
        [cleanEmail]
      );

      let applicantUserId;
      if (existingUserRes.rows[0]) {
        applicantUserId = existingUserRes.rows[0].id;
        await client.query(
          `UPDATE travora.users
           SET display_name = COALESCE($2, display_name),
               role = CASE WHEN role = 'admin' THEN 'admin' ELSE 'provider' END,
               status = 'active',
               email_verified_at = COALESCE(email_verified_at, now())
           WHERE id = $1`,
          [applicantUserId, cleanApplicantName]
        );
      } else {
        let userInsertRes;
        try {
          userInsertRes = await client.query(
            `INSERT INTO travora.users (email, email_verified_at, phone_e164, phone_verified_at, display_name, country_code, role, status)
             VALUES ($1, now(), $2, now(), $3, 'EG', 'provider', 'active')
             RETURNING id`,
            [cleanEmail, cleanPhone, cleanApplicantName]
          );
        } catch {
          const fallbackPhone = `+2010${Math.floor(10000000 + Math.random() * 89999999)}`;
          userInsertRes = await client.query(
            `INSERT INTO travora.users (email, email_verified_at, phone_e164, phone_verified_at, display_name, country_code, role, status)
             VALUES ($1, now(), $2, now(), $3, 'EG', 'provider', 'active')
             RETURNING id`,
            [cleanEmail, fallbackPhone, cleanApplicantName]
          );
        }
        applicantUserId = userInsertRes.rows[0].id;
      }

      const effectivePassword =
        password && String(password).trim().length >= 6
          ? String(password).trim()
          : 'Travora@2026!';
      const pwHash = await hashPassword(effectivePassword);
      const existingIdentity = await client.query(
        `SELECT id FROM travora.auth_identities WHERE user_id = $1 AND provider = 'password' LIMIT 1`,
        [applicantUserId]
      );
      if (existingIdentity.rows[0]) {
        await client.query(
          `UPDATE travora.auth_identities
           SET password_hash = $2, password_updated_at = now(), last_used_at = now()
           WHERE id = $1`,
          [existingIdentity.rows[0].id, pwHash]
        );
      } else {
        await client.query(
          `INSERT INTO travora.auth_identities (user_id, provider, provider_subject, password_hash, password_updated_at, last_used_at)
           VALUES ($1, 'password', $2, $3, now(), now())
           ON CONFLICT (provider, provider_subject) DO UPDATE
           SET password_hash = EXCLUDED.password_hash, password_updated_at = now()`,
          [applicantUserId, applicantUserId, pwHash]
        );
      }

      // 2. Resolve destination
      const destRes = await client.query(
        `SELECT id, slug, name_ar, latitude, longitude FROM travora.destinations WHERE slug = $1 LIMIT 1`,
        [citySlug || 'cairo']
      );
      let destination = destRes.rows[0];
      if (!destination) {
        const fallbackDest = await client.query(
          `SELECT id, slug, name_ar, latitude, longitude FROM travora.destinations ORDER BY display_order ASC LIMIT 1`
        );
        destination = fallbackDest.rows[0];
      }

      // 3. Create provider record
      const providerCode = `${slugify(cleanNameEn || partnerType)}-${crypto.randomBytes(2).toString('hex')}`;
      const providerRes = await client.query(
        `INSERT INTO travora.providers
           (code, owner_user_id, name_ar, name_en, legal_name, organization_kind, country_code, contact_email, phone_e164, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'EG', $7, $8, 'pending')
         RETURNING *, name_ar AS public_name_ar, name_en AS public_name_en`,
        [
          providerCode,
          applicantUserId,
          cleanNameAr,
          cleanNameEn,
          cleanLegalName,
          organizationKind,
          cleanEmail,
          cleanPhone,
        ]
      );
      const provider = providerRes.rows[0];

      await client.query(
        `INSERT INTO travora.provider_category_assignments (provider_id, category_code)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [provider.id, partnerType]
      );

      if (destination) {
        await client.query(
          `INSERT INTO travora.provider_branches (provider_id, destination_id, country_code, code, name_ar, name_en, address_ar, address_en, timezone, status)
           VALUES ($1, $2, 'EG', 'hq', $3, $4, $5, $6, 'Africa/Cairo', 'active')
           ON CONFLICT (provider_id, code) DO NOTHING`,
          [
            provider.id,
            destination.id,
            `${cleanNameAr} - الفرع الرئيسي`,
            `${cleanNameEn} HQ`,
            String(details.addressAr || destination.name_ar || 'مصر'),
            String(details.addressEn || destination.slug || 'Egypt'),
          ]
        );
      }

      // 4. Delegate draft catalog creation to the dedicated provider service
      if (partnerType === 'hotel') {
        await hotelService.createDraftHotelForProvider(client, {
          providerId: provider.id,
          destination,
          cleanNameAr,
          cleanNameEn,
          details,
        });
      } else if (partnerType === 'restaurant') {
        await restaurantService.createDraftRestaurantForProvider(client, {
          providerId: provider.id,
          destination,
          cleanNameAr,
          cleanNameEn,
          details,
        });
      } else if (partnerType === 'guide') {
        await guideService.createDraftGuideForProvider(client, {
          providerId: provider.id,
          destination,
          cleanNameAr,
          cleanNameEn,
          regRef,
          details,
        });
      } else if (partnerType === 'transport') {
        await transportService.createDraftTransportForProvider(client, {
          providerId: provider.id,
          destination,
          cleanNameAr,
          cleanNameEn,
          transportSubtype,
          details,
        });
      }

      // 5. Insert provider application
      const enrichedDetails = {
        ...details,
        applicantName: cleanApplicantName,
        destinationNameAr: destination?.name_ar || 'القاهرة',
        submittedVia: 'partner_portal',
      };

      const appRes = await client.query(
        `INSERT INTO travora.provider_applications
           (provider_id, applicant_user_id, legal_name, country_code, registration_reference, partner_type, transport_subtype, city_slug, details_json, status, submitted_at)
         VALUES ($1, $2, $3, 'EG', $4, $5, $6, $7, $8::jsonb, 'submitted', now())
         RETURNING *`,
        [
          provider.id,
          applicantUserId,
          cleanLegalName,
          regRef,
          partnerType,
          transportSubtype || null,
          destination?.slug || citySlug || 'cairo',
          JSON.stringify(enrichedDetails),
        ]
      );

      // 6. Audit event
      const typeLabelMap = {
        hotel: 'فندق / منتجع سياحي',
        restaurant: 'مطعم وضيافة',
        guide: 'مرشد سياحي مرخص',
        transport:
          transportSubtype === 'car_owner'
            ? 'صاحب سيارة خاصة بسائق'
            : transportSubtype === 'car_rental'
              ? 'مكتب استئجار سيارات'
              : 'شركة نقل سياحي وليموزين',
      };
      await client.query(
        `INSERT INTO travora.provider_audit_events (provider_id, actor_user_id, action, entity_type, entity_id, summary)
         VALUES ($1, $2, 'provider.application.submitted', 'provider_application', $3, $4)`,
        [
          provider.id,
          applicantUserId,
          appRes.rows[0].id,
          `طلب انضمام شريك جديد (${typeLabelMap[partnerType] || partnerType}): ${cleanNameAr} — بانتظار موافقة الإدارة.`,
        ]
      );

      await client.query('COMMIT');
      return {
        application: {
          ...appRes.rows[0],
          public_name_ar: cleanNameAr,
          public_name_en: cleanNameEn,
          contact_email: cleanEmail,
          contact_phone: cleanPhone,
          applicant_name: cleanApplicantName,
          requested_categories: [partnerType],
        },
        provider,
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  return {
    submitPublicPartnerApplication,
  };
}

module.exports = createPartnerRegisterService;
