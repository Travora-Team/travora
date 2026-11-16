const { Router } = require('express');
const { rateLimit } = require('express-rate-limit');
const createAuthService = require('./auth.service');
const createAuthController = require('./auth.controller');
const requireAuth = require('../../shared/middleware/authMiddleware');
const validateAuth = require('../../shared/middleware/validateAuth');
const { validateRegister, validateLoginInitiate, validateOTPVerify, validateOTPResend } = require('../../shared/middleware/validateAuth');
const ApiError = require('../../shared/utils/ApiError');

function limiter(limit, windowMs) {
  return rateLimit({
    limit,
    windowMs,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res, next) => next(new ApiError(429, 'RATE_LIMITED', 'محاولات كثيرة. حاول لاحقًا.')),
  });
}

function createAuthRoutes(pool, config) {
  const router = Router();
  const service = createAuthService(pool, config);
  const controller = createAuthController(service, config);
  const authenticated = requireAuth(service, config);

  const otpSendIpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res, next) => next(new ApiError(429, 'RATE_LIMITED', 'طلبات كثيرة جداً من هذا الجهاز، يرجى المحاولة بعد 15 دقيقة')),
  });

  const otpVerifyIpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 25,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res, next) => next(new ApiError(429, 'RATE_LIMITED', 'محاولات تحقق كثيرة جداً، يرجى الانتظار قليلاً')),
  });

  router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    if (req.method === 'POST' && !req.is('application/json')) {
      return next(new ApiError(415, 'UNSUPPORTED_MEDIA_TYPE', 'استخدم Content-Type: application/json.'));
    }
    next();
  });

  // التسجيل (مباشر أو مع OTP)
  router.post(
    '/register',
    limiter(config.registerLimit, 60 * 60 * 1000),
    validateRegister,
    controller.register
  );

  // تأكيد التسجيل برمز التحقق
  router.post(
    '/register/verify-otp',
    otpVerifyIpLimiter,
    validateOTPVerify,
    controller.verifyRegistration
  );

  // تسجيل الدخول المباشر (كلمة المرور)
  router.post(
    '/login',
    limiter(config.loginLimit, 15 * 60 * 1000),
    validateAuth('login'),
    controller.login
  );

  // بدء تسجيل الدخول بالـ OTP
  router.post(
    '/login/initiate',
    otpSendIpLimiter,
    validateLoginInitiate,
    controller.initiateLogin
  );

  // إتمام تسجيل الدخول برمز التحقق
  router.post(
    '/login/verify-otp',
    otpVerifyIpLimiter,
    validateOTPVerify,
    controller.verifyLogin
  );

  // إعادة إرسال الرمز
  router.post(
    '/otp/resend',
    otpSendIpLimiter,
    validateOTPResend,
    controller.resendOTP
  );

  // الحساب الحالي وتسجيل الخروج
  router.get('/me', authenticated, controller.me);
  router.post('/logout', authenticated, controller.logout);

  return router;
}

module.exports = createAuthRoutes;
