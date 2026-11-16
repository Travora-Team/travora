const ApiError = require('../utils/ApiError');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_REGEX = /^\d{6}$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VALID_CHANNELS = ['EMAIL', 'SMS', 'WHATSAPP'];
const PHONE_CHANNELS = ['SMS', 'WHATSAPP'];
const VALID_PURPOSES = ['REGISTER_VERIFY', 'LOGIN_OTP'];

/**
 * التحقق من بيانات إنشاء الحساب الجديد
 */
function validateRegister(req, res, next) {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return next(new ApiError(400, 'VALIDATION_ERROR', 'أرسل بيانات الحساب ككائن JSON.'));
  }

  const fullName = (typeof body.fullName === 'string' ? body.fullName : (typeof body.name === 'string' ? body.name : '')).trim();
  const email = (typeof body.email === 'string' ? body.email : '').trim().toLowerCase();
  const phoneNumber = (typeof body.phoneNumber === 'string' ? body.phoneNumber : (typeof body.phone === 'string' ? body.phone : '')).trim();
  const password = typeof body.password === 'string' ? body.password : '';
  const verifyChannel = body.verifyChannel ? String(body.verifyChannel).toUpperCase() : null;

  const details = {};

  if (!fullName || fullName.length < 2 || fullName.length > 120 || /[\u0000-\u001f\u007f]/u.test(fullName)) {
    details.name = 'الاسم مطلوب ويجب أن يكون بين حرفين و120 حرفًا.';
  }

  if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
    details.email = 'يرجى إدخال بريد إلكتروني صالح.';
  }

  if (!password || password.length < 8 || password.length > 128) {
    details.password = 'كلمة المرور يجب أن تتكون من 8 أحرف على الأقل وبحد أقصى 128 حرفًا.';
  }

  if (verifyChannel && !VALID_CHANNELS.includes(verifyChannel)) {
    details.verifyChannel = 'قناة التحقق يجب أن تكون EMAIL أو SMS أو WHATSAPP.';
  }

  if (verifyChannel && PHONE_CHANNELS.includes(verifyChannel) && !phoneNumber) {
    details.phoneNumber = 'رقم الهاتف مطلوب عند اختيار التحقق عبر SMS أو WHATSAPP.';
  }

  if (Object.keys(details).length > 0) {
    return next(new ApiError(400, 'VALIDATION_ERROR', 'بيانات الحساب غير صالحة.', details));
  }

  req.authInput = {
    name: fullName,
    fullName,
    email,
    phoneNumber: phoneNumber || null,
    password,
    verifyChannel,
  };

  next();
}

/**
 * التحقق من بيانات بدء تسجيل الدخول
 */
function validateLoginInitiate(req, res, next) {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return next(new ApiError(400, 'VALIDATION_ERROR', 'أرسل بيانات الدخول ككائن JSON.'));
  }

  const identifier = (typeof body.identifier === 'string' ? body.identifier : (typeof body.email === 'string' ? body.email : '')).trim();
  const password = typeof body.password === 'string' ? body.password : '';
  const channel = body.channel || 'EMAIL';

  if (!identifier) {
    return next(new ApiError(400, 'VALIDATION_ERROR', 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف.'));
  }

  if (!password) {
    return next(new ApiError(400, 'VALIDATION_ERROR', 'يرجى إدخال كلمة المرور.'));
  }

  if (!VALID_CHANNELS.includes(channel)) {
    return next(new ApiError(400, 'VALIDATION_ERROR', 'قناة استلام الرمز يجب أن تكون EMAIL أو SMS أو WHATSAPP.'));
  }

  req.authInput = { identifier, password, channel };
  next();
}

/**
 * التحقق من صيغة رمز الـ OTP ومعرف المستخدم
 */
function validateOTPVerify(req, res, next) {
  const body = req.body || {};
  const { userId, channel = 'EMAIL', code } = body;

  if (!userId || !UUID_REGEX.test(userId)) {
    return next(new ApiError(400, 'VALIDATION_ERROR', 'معرف المستخدم (userId) غير صالح.'));
  }

  if (!VALID_CHANNELS.includes(channel)) {
    return next(new ApiError(400, 'VALIDATION_ERROR', 'قناة التحقق غير صالحة.'));
  }

  if (!code || typeof code !== 'string' || !OTP_REGEX.test(code.trim())) {
    return next(new ApiError(400, 'VALIDATION_ERROR', 'رمز التحقق يجب أن يتكون من 6 أرقام فقط.'));
  }

  req.body.code = code.trim();
  next();
}

/**
 * التحقق من طلب إعادة إرسال الرمز
 */
function validateOTPResend(req, res, next) {
  const body = req.body || {};
  const { userId, channel, purpose } = body;

  if (!userId || !UUID_REGEX.test(userId)) {
    return next(new ApiError(400, 'VALIDATION_ERROR', 'معرف المستخدم (userId) غير صالح.'));
  }

  if (!channel || !VALID_CHANNELS.includes(channel)) {
    return next(new ApiError(400, 'VALIDATION_ERROR', 'قناة الإرسال يجب أن تكون EMAIL أو SMS أو WHATSAPP.'));
  }

  if (!purpose || !VALID_PURPOSES.includes(purpose)) {
    return next(new ApiError(400, 'VALIDATION_ERROR', 'الغرض من الرمز غير صالح.'));
  }

  next();
}

function validateAuth(kind) {
  if (kind === 'register') return validateRegister;
  return (req, res, next) => {
    const body = req.body || {};
    const email = (typeof body.email === 'string' ? body.email : (typeof body.identifier === 'string' ? body.identifier : '')).trim().toLowerCase();
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || !password) {
      return next(new ApiError(400, 'VALIDATION_ERROR', 'البريد الإلكتروني وكلمة المرور مطلوبان.'));
    }
    req.authInput = { email, password };
    next();
  };
}

validateAuth.validateRegister = validateRegister;
validateAuth.validateLoginInitiate = validateLoginInitiate;
validateAuth.validateOTPVerify = validateOTPVerify;
validateAuth.validateOTPResend = validateOTPResend;

module.exports = validateAuth;
