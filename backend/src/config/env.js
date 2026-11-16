const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

function integer(env, name, fallback, min, max) {
  const value = env[name] === undefined ? fallback : Number(env[name]);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}.`);
  }
  return value;
}

function loadConfig(env = process.env) {
  const environment = env.NODE_ENV || 'development';
  if (!['development', 'test', 'production'].includes(environment)) throw new Error('Invalid NODE_ENV.');
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL is required. See .env.example.');
  if (!['postgres:', 'postgresql:'].includes(new URL(env.DATABASE_URL).protocol)) {
    throw new Error('DATABASE_URL must point to PostgreSQL.');
  }
  const origins = (env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',').map((value) => value.trim()).filter(Boolean);
  if (environment === 'production' && !env.CORS_ORIGINS) throw new Error('Set CORS_ORIGINS in production.');
  for (const origin of origins) {
    const parsed = new URL(origin);
    if (parsed.origin !== origin || !['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('CORS_ORIGINS must contain exact HTTP(S) origins without paths.');
    }
  }
  return Object.freeze({
    environment, databaseUrl: env.DATABASE_URL, host: env.HOST || '127.0.0.1',
    port: integer(env, 'PORT', 3000, 1, 65535),
    poolMax: integer(env, 'DB_POOL_MAX', 10, 1, 100),
    sessionTtlDays: integer(env, 'SESSION_TTL_DAYS', 7, 1, 30),
    loginLimit: integer(env, 'AUTH_LOGIN_LIMIT', 10, 1, 10000),
    registerLimit: integer(env, 'AUTH_REGISTER_LIMIT', 5, 1, 10000),
    trustProxyHops: integer(env, 'TRUST_PROXY_HOPS', 0, 0, 5),
    allowedOrigins: origins, secureCookies: environment === 'production',
    cookieName: environment === 'production' ? '__Host-travora_session' : 'travora_session',
    otpSecret: env.OTP_SECRET || 'dev_secret_key_travora_smart_tourism_platform_2026_super_secure_hex',
    otpExpiryMinutes: integer(env, 'OTP_EXPIRY_MINUTES', 5, 1, 60),
    otpBaseCooldownSeconds: integer(env, 'OTP_BASE_COOLDOWN_SECONDS', 60, 1, 3600),
    otpMaxSendsPerHour: integer(env, 'OTP_MAX_SENDS_PER_HOUR', 5, 1, 100),
    otpMaxVerifyAttempts: integer(env, 'OTP_MAX_VERIFY_ATTEMPTS', 5, 1, 20),
    otpDevFallback: env.OTP_DEV_FALLBACK === 'true' || environment === 'test',
    resendApiKey: env.RESEND_API_KEY || '',
    resendFromEmail: env.RESEND_FROM_EMAIL || 'Travora <onboarding@resend.dev>',
    twilioAccountSid: env.TWILIO_ACCOUNT_SID || '',
    twilioAuthToken: env.TWILIO_AUTH_TOKEN || '',
    twilioPhoneNumber: env.TWILIO_PHONE_NUMBER || '',
    twilioWhatsAppNumber: env.TWILIO_WHATSAPP_NUMBER || '',
  });
}

module.exports = {
  loadConfig,
  get OTP_SECRET() { return process.env.OTP_SECRET || 'dev_secret_key_travora_smart_tourism_platform_2026_super_secure_hex'; },
  get OTP_EXPIRY_MINUTES() { return process.env.OTP_EXPIRY_MINUTES ? Number(process.env.OTP_EXPIRY_MINUTES) : 5; },
  get OTP_BASE_COOLDOWN_SECONDS() { return process.env.OTP_BASE_COOLDOWN_SECONDS ? Number(process.env.OTP_BASE_COOLDOWN_SECONDS) : 60; },
  get OTP_MAX_SENDS_PER_HOUR() { return process.env.OTP_MAX_SENDS_PER_HOUR ? Number(process.env.OTP_MAX_SENDS_PER_HOUR) : 5; },
  get OTP_MAX_VERIFY_ATTEMPTS() { return process.env.OTP_MAX_VERIFY_ATTEMPTS ? Number(process.env.OTP_MAX_VERIFY_ATTEMPTS) : 5; },
  get OTP_DEV_FALLBACK() { return process.env.OTP_DEV_FALLBACK !== undefined ? process.env.OTP_DEV_FALLBACK : 'false'; },
  get RESEND_API_KEY() { return process.env.RESEND_API_KEY || ''; },
  get RESEND_FROM_EMAIL() { return process.env.RESEND_FROM_EMAIL || 'Travora <onboarding@resend.dev>'; },
  get TWILIO_ACCOUNT_SID() { return process.env.TWILIO_ACCOUNT_SID || ''; },
  get TWILIO_AUTH_TOKEN() { return process.env.TWILIO_AUTH_TOKEN || ''; },
  get TWILIO_PHONE_NUMBER() { return process.env.TWILIO_PHONE_NUMBER || ''; },
  get TWILIO_WHATSAPP_NUMBER() { return process.env.TWILIO_WHATSAPP_NUMBER || ''; },
  get NODE_ENV() { return process.env.NODE_ENV || 'development'; },
};
