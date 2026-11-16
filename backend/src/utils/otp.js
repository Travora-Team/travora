const crypto = require('crypto');
const env = require('../config/env');

/**
 * توليد رمز OTP من 6 أرقام باستخدام مولد عشوائي آمن تشفيرياً (CSPRNG)
 */
function generateOTPCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * تشفير الرمز باستخدام HMAC-SHA256 مع ربطه بالمستهدف (الإيميل/الهاتف) والغرض
 * لمنع استغلال الهاش عبر مستخدمين مختلفين أو أغراض مختلفة
 */
function hashOTPCode(code, target, purpose, secret) {
  const normalizedTarget = (target || '').trim().toLowerCase();
  const payload = `${code}:${normalizedTarget}:${purpose}`;
  const hmacSecret = secret || env.OTP_SECRET || 'dev_secret_key_travora_smart_tourism_platform_2026_super_secure_hex';
  return crypto
    .createHmac('sha256', hmacSecret)
    .update(payload)
    .digest('hex');
}

/**
 * مقارنة الرمز المدخل مع الهاش المخزن بطريقة محمية ضد هجمات التوقيت (Timing Attacks)
 */
function verifyOTPHash(inputCode, storedHash, target, purpose, secret) {
  if (!inputCode || !storedHash) return false;
  const computedHash = hashOTPCode(inputCode, target, purpose, secret);
  const computedBuffer = Buffer.from(computedHash, 'hex');
  const storedBuffer = Buffer.from(storedHash, 'hex');

  if (computedBuffer.length !== storedBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(computedBuffer, storedBuffer);
}

module.exports = {
  generateOTPCode,
  hashOTPCode,
  verifyOTPHash,
};
