const defaultDb = require('../../shared/config/db');
const { withTransaction } = require('../../shared/config/db');
const { loadConfig } = require('../../shared/config/env');
const ApiError = require('../../shared/utils/ApiError');
const { hashPassword, verifyPassword } = require('../../shared/utils/password');
const { newToken, hashToken, createSession: utilsCreateSession } = require('../../shared/utils/session');
const { issueOTP, verifyOTP } = require('../../shared/services/otpService');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const createAdminSeedService = require('../admin/services/adminSeed.service');

const DEMO_LOGIN_EMAILS = new Set([
  'admin@travora.eg',
  'eng.yousif.fares@gmail.com',
  'nile.palace@travora.eg',
  'elgouna.dining@travora.eg',
  'luxor.guides@travora.eg',
  'cairo.vip.fleet@travora.eg',
  'siwa.oasis.resort@travora.eg',
  'ahmed.mansour@example.com',
]);

function normalizePhone(phone) {
  if (!phone) return null;
  const parsed = parsePhoneNumberFromString(phone);
  if (!parsed || !parsed.isValid()) {
    throw new ApiError(400, 'INVALID_PHONE', 'رقم الهاتف غير صالح. يرجى إدخاله بالصيغة الدولية مثل +2010... أو +9665...');
  }
  return parsed.number;
}

function formatUser(row) {
  if (!row) return null;
  const isEmailVerified = Boolean(row.email_verified_at || row.is_email_verified);
  const isPhoneVerified = Boolean(row.phone_verified_at || row.is_phone_verified);
  return {
    id: row.id,
    name: row.display_name || row.name || '',
    fullName: row.display_name || row.name || '',
    email: row.email,
    phoneNumber: row.phone_e164 || row.phone_number || null,
    phone: row.phone_e164 || row.phone_number || null,
    role: row.role || 'traveler',
    status: row.status || 'active',
    account_status: row.status === 'active' ? (isEmailVerified || isPhoneVerified ? 'ACTIVE' : 'PENDING_VERIFICATION') : (row.status || '').toUpperCase(),
    emailVerified: isEmailVerified,
    is_email_verified: isEmailVerified,
    phoneVerified: isPhoneVerified,
    is_phone_verified: isPhoneVerified,
    createdAt: row.created_at,
  };
}

const userColumns = `id, display_name, email, phone_e164, role, status,
  email_verified_at, phone_verified_at, created_at`;
const publicFields = `u.id, u.display_name, u.email, u.phone_e164, u.role, u.status,
  u.email_verified_at, u.phone_verified_at, u.created_at`;
const invalidCredentials = () => new ApiError(401, 'INVALID_CREDENTIALS', 'البريد الإلكتروني أو كلمة المرور غير صحيحة.');

function createAuthService(pool = defaultDb, config = loadConfig()) {
  const adminSeedService = createAdminSeedService(pool);

  async function ensureDemoAccountIfNeeded(identifier) {
    if (!identifier) return;
    const clean = String(identifier).trim().toLowerCase();
    if (DEMO_LOGIN_EMAILS.has(clean)) {
      await adminSeedService.ensureSeedData();
    }
  }

  async function enrichUser(clientOrPool, user) {
    if (!user || user.role !== 'provider') return user;
    try {
      const provRes = await clientOrPool.query(
        `SELECT p.id, p.code, p.name_ar, p.status AS provider_status,
                (SELECT pca.category_code FROM travora.provider_category_assignments pca WHERE pca.provider_id = p.id LIMIT 1) AS category_code,
                pa.partner_type,
                pa.transport_subtype,
                pa.status AS application_status
         FROM travora.providers p
         LEFT JOIN travora.provider_applications pa ON pa.provider_id = p.id
         WHERE p.owner_user_id = $1
         ORDER BY p.created_at DESC
         LIMIT 1`,
        [user.id]
      );
      const prov = provRes.rows[0];
      if (!prov) {
        return {
          ...user,
          providerType: 'hotel',
          providerStatus: 'pending',
          applicationStatus: 'submitted',
        };
      }
      const catCode = prov.category_code;
      const appType = prov.partner_type;
      const rawType =
        catCode && ['hotel', 'restaurant', 'guide', 'transport'].includes(catCode)
          ? catCode
          : appType || 'hotel';
      const normalizedType = ['hotel', 'restaurant', 'guide', 'transport'].includes(rawType)
        ? rawType
        : 'hotel';

      return {
        ...user,
        providerId: prov.id,
        providerCode: prov.code,
        providerName: prov.name_ar,
        providerStatus: prov.provider_status,
        providerType: normalizedType,
        transportSubtype: prov.transport_subtype || (normalizedType === 'transport' ? 'transport_company' : null),
        applicationStatus: prov.application_status || (prov.provider_status === 'active' ? 'approved' : 'submitted'),
      };
    } catch {
      return {
        ...user,
        providerType: 'hotel',
      };
    }
  }

  async function createSession(client, userId, deviceLabel, previousToken) {
    return utilsCreateSession(client, userId, deviceLabel, previousToken, config.sessionTtlDays);
  }

  async function register(input, deviceLabel, previousToken, ipAddress) {
    const rawEmail = input.email || '';
    const normalizedEmail = rawEmail.trim().toLowerCase();
    const displayName = (input.fullName || input.name || '').trim();
    const rawPhone = input.phoneNumber || input.phone;
    const formattedPhone = rawPhone ? normalizePhone(rawPhone) : null;
    const verifyChannel = input.verifyChannel; // 'EMAIL', 'SMS', 'WHATSAPP'

    if (verifyChannel === 'SMS' && !formattedPhone) {
      throw new ApiError(400, 'PHONE_REQUIRED', 'يجب إدخال رقم الهاتف لاختيار التحقق عبر الرسائل النصية');
    }

    try {
      return await withTransaction(pool, async (client) => {
        const passwordHash = await hashPassword(input.password);
        const userResult = await client.query(
          `INSERT INTO travora.users (email, display_name, phone_e164, phone_number, account_status)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING ${userColumns}`,
          [normalizedEmail, displayName, formattedPhone, formattedPhone, verifyChannel ? 'PENDING_VERIFICATION' : 'ACTIVE']
        );
        const userRow = userResult.rows[0];

        await client.query(
          `INSERT INTO travora.auth_identities (user_id, provider, provider_subject, password_hash)
           VALUES ($1, 'password', $2, $3)`,
          [userRow.id, userRow.id, passwordHash]
        );

        await client.query(
          `INSERT INTO travora.user_preferences (user_id)
           VALUES ($1)
           ON CONFLICT (user_id) DO NOTHING`,
          [userRow.id]
        );

        const user = formatUser(userRow);

        // إذا تم تحديد قناة تحقق OTP
        if (verifyChannel) {
          const target = verifyChannel === 'SMS' || verifyChannel === 'WHATSAPP' ? user.phoneNumber : user.email;
          const otpInfo = await issueOTP({
            userId: user.id,
            target,
            channel: verifyChannel,
            purpose: 'REGISTER_VERIFY',
            ipAddress,
            pool: client,
            config,
          });

          return {
            user,
            userId: user.id,
            verification: otpInfo,
            message: 'تم إنشاء الحساب بنجاح، يرجى إدخال رمز التحقق لتفعيل الحساب',
          };
        }

        // في حال التسجيل المباشر بدون OTP
        const session = await createSession(client, user.id, deviceLabel, previousToken);
        return { user, session };
      });
    } catch (error) {
      if (error.code === '23505') {
        if (error.constraint === 'users_email_unique') {
          throw new ApiError(409, 'EMAIL_ALREADY_EXISTS', 'البريد الإلكتروني مسجل بالفعل.');
        }
        throw new ApiError(409, 'USER_ALREADY_EXISTS', 'البريد الإلكتروني أو رقم الهاتف مسجل بالفعل.');
      }
      throw error;
    }
  }

  async function verifyAccountRegistration({ userId, channel, code, deviceLabel, previousToken }) {
    const userResult = await pool.query(`SELECT ${publicFields} FROM travora.users u WHERE u.id = $1`, [userId]);
    const userRow = userResult.rows[0];

    if (!userRow) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'المستخدم غير موجود');
    }

    const target = channel === 'SMS' || channel === 'WHATSAPP' ? userRow.phone_e164 : userRow.email;

    await verifyOTP({
      userId,
      target,
      channel,
      purpose: 'REGISTER_VERIFY',
      code,
      pool,
      config,
    });

    const isPhoneChannel = channel === 'SMS' || channel === 'WHATSAPP';
    const verifySql = isPhoneChannel
      ? `UPDATE travora.users SET phone_verified_at = NOW(), is_phone_verified = TRUE, status = 'active', account_status = 'ACTIVE', updated_at = NOW() WHERE id = $1 RETURNING ${userColumns}`
      : `UPDATE travora.users SET email_verified_at = NOW(), is_email_verified = TRUE, status = 'active', account_status = 'ACTIVE', updated_at = NOW() WHERE id = $1 RETURNING ${userColumns}`;

    const updatedUserResult = await pool.query(verifySql, [userId]);
    const user = formatUser(updatedUserResult.rows[0]);
    const session = await createSession(pool, userId, deviceLabel, previousToken);

    return {
      message: 'تم تفعيل الحساب بنجاح',
      user,
      session,
    };
  }

  async function initiateLoginWithOTP({ identifier, password, channel = 'EMAIL', ipAddress }) {
    const cleanId = (identifier || '').trim();
    const isEmail = cleanId.includes('@');
    const lookupParam = isEmail ? cleanId.toLowerCase() : cleanId;

    await ensureDemoAccountIfNeeded(lookupParam);

    const query = isEmail
      ? `SELECT u.id, a.password_hash, u.status, u.deleted_at, ${publicFields}
         FROM travora.users u JOIN travora.auth_identities a ON a.user_id = u.id
         WHERE u.email = $1 AND a.provider = 'password'`
      : `SELECT u.id, a.password_hash, u.status, u.deleted_at, ${publicFields}
         FROM travora.users u JOIN travora.auth_identities a ON a.user_id = u.id
         WHERE (u.phone_e164 = $1 OR u.phone_number = $1) AND a.provider = 'password'`;

    const { rows } = await pool.query(query, [lookupParam]);
    const identity = rows[0];

    const verified = await verifyPassword(identity?.password_hash, password);
    if (!identity || !verified || identity.status !== 'active' || identity.deleted_at) {
      throw invalidCredentials();
    }

    const target = channel === 'SMS' || channel === 'WHATSAPP' ? identity.phone_e164 : identity.email;
    if (!target) {
      throw new ApiError(400, 'CHANNEL_NOT_AVAILABLE', `لا يوجد ${channel === 'EMAIL' ? 'بريد إلكتروني' : 'رقم هاتف'} مسجل لهذا الحساب`);
    }

    const otpInfo = await issueOTP({
      userId: identity.id,
      target,
      channel,
      purpose: 'LOGIN_OTP',
      ipAddress,
      pool,
      config,
    });

    return {
      message: 'تم إرسال رمز التحقق لإتمام تسجيل الدخول',
      userId: identity.id,
      verification: otpInfo,
    };
  }

  async function completeLoginWithOTP({ userId, channel, code, deviceLabel, previousToken }) {
    const userResult = await pool.query(`SELECT ${publicFields} FROM travora.users u WHERE u.id = $1`, [userId]);
    const userRow = userResult.rows[0];

    if (!userRow) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'المستخدم غير موجود');
    }

    const target = channel === 'SMS' || channel === 'WHATSAPP' ? userRow.phone_e164 : userRow.email;

    await verifyOTP({
      userId,
      target,
      channel,
      purpose: 'LOGIN_OTP',
      code,
      pool,
      config,
    });

    await pool.query('UPDATE travora.users SET last_login_at = NOW() WHERE id = $1', [userId]);
    const user = await enrichUser(pool, formatUser(userRow));
    const session = await createSession(pool, userId, deviceLabel, previousToken);

    return {
      message: 'تم تسجيل الدخول بنجاح',
      user,
      session,
    };
  }

  async function resendOTP({ userId, channel, purpose, ipAddress }) {
    const userResult = await pool.query(`SELECT ${publicFields} FROM travora.users u WHERE u.id = $1`, [userId]);
    const user = userResult.rows[0];

    if (!user) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'المستخدم غير موجود');
    }

    const target = channel === 'SMS' || channel === 'WHATSAPP' ? user.phone_e164 : user.email;
    if (!target) {
      throw new ApiError(400, 'TARGET_NOT_FOUND', 'القناة المطلوبة غير متوفرة لهذا المستخدم');
    }

    const otpInfo = await issueOTP({
      userId: user.id,
      target,
      channel,
      purpose,
      ipAddress,
      pool,
      config,
    });

    return {
      message: 'تم إعادة إرسال رمز التحقق بنجاح',
      verification: otpInfo,
    };
  }

  async function login(input, deviceLabel, previousToken) {
    const cleanEmail = (input.email || input.identifier || '').trim().toLowerCase();
    await ensureDemoAccountIfNeeded(cleanEmail);

    const { rows } = await pool.query(
      `SELECT u.id, a.password_hash, u.status, u.deleted_at
       FROM travora.users u JOIN travora.auth_identities a ON a.user_id = u.id
       WHERE u.email = $1 AND a.provider = 'password'`,
      [cleanEmail]
    );
    const identity = rows[0];
    const verified = await verifyPassword(identity?.password_hash, input.password);
    if (!identity || !verified || identity.status !== 'active' || identity.deleted_at) throw invalidCredentials();

    return withTransaction(pool, async (client) => {
      const result = await client.query(
        `SELECT ${publicFields}
         FROM travora.users u JOIN travora.auth_identities a ON a.user_id = u.id
         WHERE u.id = $1 AND u.status = 'active' AND u.deleted_at IS NULL
           AND a.provider = 'password' AND a.password_hash = $2 FOR UPDATE OF u, a`,
        [identity.id, identity.password_hash]
      );
      if (!result.rowCount) throw invalidCredentials();
      await client.query('UPDATE travora.users SET last_login_at = now() WHERE id = $1', [identity.id]);
      const user = await enrichUser(client, formatUser(result.rows[0]));
      return { user, session: await createSession(client, identity.id, deviceLabel, previousToken) };
    });
  }

  async function authenticate(token) {
    if (!token) return null;
    const { rows } = await pool.query(
      `UPDATE travora.sessions s SET last_seen_at = now()
       FROM travora.users u WHERE s.user_id = u.id AND s.token_hash = $1
         AND s.revoked_at IS NULL AND s.expires_at > now() AND u.status = 'active' AND u.deleted_at IS NULL
       RETURNING ${publicFields}, s.id AS session_id`,
      [hashToken(token)]
    );
    if (!rows[0]) return null;
    const { session_id: sessionId, ...userRow } = rows[0];
    const user = await enrichUser(pool, formatUser(userRow));
    return { user, sessionId };
  }

  async function logout(auth) {
    await pool.query(
      'UPDATE travora.sessions SET revoked_at = COALESCE(revoked_at, now()) WHERE id = $1 AND user_id = $2',
      [auth.sessionId, auth.user.id]
    );
  }

  return {
    register,
    registerUser: register,
    verifyAccountRegistration,
    initiateLoginWithOTP,
    completeLoginWithOTP,
    resendOTP,
    login,
    authenticate,
    logout,
  };
}

const defaultService = createAuthService();

module.exports = createAuthService;
module.exports.createAuthService = createAuthService;
module.exports.registerUser = (args) => defaultService.register(args);
module.exports.verifyAccountRegistration = (args) => defaultService.verifyAccountRegistration(args);
module.exports.initiateLoginWithOTP = (args) => defaultService.initiateLoginWithOTP(args);
module.exports.completeLoginWithOTP = (args) => defaultService.completeLoginWithOTP(args);
module.exports.resendOTP = (args) => defaultService.resendOTP(args);
module.exports.login = (args) => defaultService.login(args);
module.exports.authenticate = (args) => defaultService.authenticate(args);
module.exports.logout = (args) => defaultService.logout(args);
