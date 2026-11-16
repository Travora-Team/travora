const db = require('../config/db');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const { generateOTPCode, hashOTPCode, verifyOTPHash } = require('../utils/otp');
const { sendEmailOTP, sendSmsOTP, sendWhatsAppOTP } = require('./notificationService');

/**
 * إصدار أو إعادة إرسال رمز OTP مع تطبيق حدود الأمان وفترة الانتظار التصاعدية
 */
async function issueOTP({ userId, target, channel, purpose, ipAddress, pool: customPool, config: customConfig }) {
  const queryRunner = customPool || db;
  const config = customConfig || env;

  // 1. حساب عدد الرسائل المرسلة لهذا الهدف (إيميل/هاتف) خلال آخر ساعة
  const hourlyStats = await queryRunner.query(
    `SELECT COUNT(*)::int AS total_requests,
            MAX(next_resend_at) AS latest_resend_lock,
            MAX(send_count)::int AS max_send_count
     FROM travora.otp_verifications
     WHERE target = $1 AND created_at > NOW() - INTERVAL '1 hour'`,
    [target]
  );

  const { total_requests, latest_resend_lock, max_send_count } = hourlyStats.rows[0] || {};

  // أ) التحقق من عدم تجاوز الحد الأقصى في الساعة (مثلاً 5 مرات)
  const maxSendsPerHour = Number(config.otpMaxSendsPerHour || env.OTP_MAX_SENDS_PER_HOUR || 5);
  if (total_requests >= maxSendsPerHour) {
    throw new ApiError(
      429,
      'RATE_LIMITED',
      'لقد تجاوزت الحد الأقصى لطلب الرمز. يرجى الانتظار لمدة ساعة قبل المحاولة مجدداً.'
    );
  }

  // ب) التحقق من فترة التهدئة الحالية (Cooldown) قبل السماح بإعادة الإرسال
  if (latest_resend_lock && new Date(latest_resend_lock) > new Date()) {
    const remainingSeconds = Math.ceil((new Date(latest_resend_lock) - new Date()) / 1000);
    throw new ApiError(
      429,
      'COOLDOWN_ACTIVE',
      `يرجى الانتظار ${remainingSeconds} ثانية قبل طلب رمز جديد.`
    );
  }

  // 2. إبطال جميع الرموز السابقة غير المستخدمة لنفس المستخدم والغرض والقناة
  await queryRunner.query(
    `UPDATE travora.otp_verifications
     SET consumed_at = NOW(), updated_at = NOW()
     WHERE user_id = $1 AND purpose = $2 AND channel = $3 AND consumed_at IS NULL`,
    [userId, purpose, channel]
  );

  // 3. توليد الرمز وتشفيره
  const rawCode = generateOTPCode();
  const secret = config.otpSecret || env.OTP_SECRET;
  const codeHash = hashOTPCode(rawCode, target, purpose, secret);

  // 4. حساب فترة الانتظار التصاعدية (Progressive Cooldown: 60s -> 120s -> 240s...)
  const currentSendCount = (max_send_count || 0) + 1;
  const baseCooldown = Number(config.otpBaseCooldownSeconds || env.OTP_BASE_COOLDOWN_SECONDS || 60);
  const cooldownSeconds = baseCooldown * Math.pow(2, currentSendCount - 1);
  const expiryMinutes = Number(config.otpExpiryMinutes || env.OTP_EXPIRY_MINUTES || 5);

  // 5. حفظ الرمز المشفر في قاعدة البيانات
  const insertResult = await queryRunner.query(
    `INSERT INTO travora.otp_verifications 
      (user_id, target, channel, purpose, code_hash, max_attempts, send_count, next_resend_at, expires_at, ip_address)
     VALUES 
      ($1, $2, $3, $4, $5, $6, $7, NOW() + ($8 || ' seconds')::interval, NOW() + ($9 || ' minutes')::interval, $10)
     RETURNING next_resend_at, expires_at`,
    [
      userId,
      target,
      channel,
      purpose,
      codeHash,
      Number(config.otpMaxVerifyAttempts || env.OTP_MAX_VERIFY_ATTEMPTS || 5),
      currentSendCount,
      cooldownSeconds,
      expiryMinutes,
      ipAddress || null,
    ]
  );

  // 6. إرسال الرمز الفعلي عبر القناة المحددة
  const devFallback = Boolean(config.otpDevFallback || String(env.OTP_DEV_FALLBACK) === 'true');
  let deliveryResult;
  if (channel === 'EMAIL') {
    deliveryResult = await sendEmailOTP(target, rawCode, purpose, { devFallback });
  } else if (channel === 'SMS') {
    deliveryResult = await sendSmsOTP(target, rawCode, purpose, { devFallback });
  } else if (channel === 'WHATSAPP') {
    deliveryResult = await sendWhatsAppOTP(target, rawCode, purpose, { devFallback });
  } else {
    throw new ApiError(400, 'INVALID_CHANNEL', 'قناة الإرسال غير مدعومة');
  }

  return {
    channel,
    target,
    delivered: Boolean(deliveryResult?.delivered),
    cooldownSeconds,
    nextResendAt: insertResult.rows[0].next_resend_at,
    expiresAt: insertResult.rows[0].expires_at,
    ...(devFallback ? { devCode: rawCode } : {}),
  };
}

/**
 * التحقق من صحة الرمز المدخل مع حماية ضد التخمين (Brute-Force Protection)
 */
async function verifyOTP({ userId, target, channel, purpose, code, pool: customPool, config: customConfig }) {
  const queryRunner = customPool || db;
  const config = customConfig || env;
  const secret = config.otpSecret || env.OTP_SECRET;

  // جلب آخر رمز فعال غير مستهلك
  const result = await queryRunner.query(
    `SELECT * FROM travora.otp_verifications
     WHERE user_id = $1 AND target = $2 AND channel = $3 AND purpose = $4 AND consumed_at IS NULL
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId, target, channel, purpose]
  );

  const otpRecord = result.rows[0];

  if (!otpRecord) {
    throw new ApiError(400, 'OTP_NOT_FOUND', 'لا يوجد رمز تحقق فعال، يرجى طلب رمز جديد');
  }

  // 1. التحقق من انتهاء الصلاحية الزمنية
  if (new Date(otpRecord.expires_at) < new Date()) {
    await queryRunner.query(`UPDATE travora.otp_verifications SET consumed_at = NOW() WHERE id = $1`, [otpRecord.id]);
    throw new ApiError(400, 'OTP_EXPIRED', 'انتهت صلاحية رمز التحقق، يرجى طلب رمز جديد');
  }

  // 2. التحقق من عدد المحاولات الفاشلة
  if (otpRecord.attempts >= otpRecord.max_attempts) {
    await queryRunner.query(`UPDATE travora.otp_verifications SET consumed_at = NOW() WHERE id = $1`, [otpRecord.id]);
    throw new ApiError(429, 'OTP_MAX_ATTEMPTS', 'تم استنفاد جميع المحاولات المسموحة لهذا الرمز. يرجى طلب رمز جديد');
  }

  // 3. مطابقة الهاش بشكل آمن ضد هجمات التوقيت
  const isValid = verifyOTPHash(code, otpRecord.code_hash, target, purpose, secret);

  if (!isValid) {
    const updated = await queryRunner.query(
      `UPDATE travora.otp_verifications 
       SET attempts = attempts + 1, updated_at = NOW() 
       WHERE id = $1 
       RETURNING attempts, max_attempts`,
      [otpRecord.id]
    );

    const remaining = updated.rows[0].max_attempts - updated.rows[0].attempts;
    if (remaining <= 0) {
      await queryRunner.query(`UPDATE travora.otp_verifications SET consumed_at = NOW() WHERE id = $1`, [otpRecord.id]);
      throw new ApiError(429, 'OTP_BURNED', 'رمز غير صحيح. تم إبطال الرمز لتجاوز الحد الأقصى للمحاولات');
    }

    throw new ApiError(400, 'INVALID_OTP', `رمز التحقق غير صحيح. المحاولات المتبقية: ${remaining}`);
  }

  // 4. استهلاك الرمز فوراً لمنع إعادة استخدامه (Replay Attack Prevention)
  await queryRunner.query(
    `UPDATE travora.otp_verifications SET consumed_at = NOW(), updated_at = NOW() WHERE id = $1`,
    [otpRecord.id]
  );

  return true;
}

module.exports = {
  issueOTP,
  verifyOTP,
};
