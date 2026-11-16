const ApiError = require('../utils/ApiError');
const { readToken, clearSessionCookie } = require('../utils/session');
function requireAuth(service, config) {
  return async (req, res, next) => {
    req.auth = await service.authenticate(readToken(req, config));
    if (!req.auth) {
      clearSessionCookie(res, config);
      return next(new ApiError(401, 'UNAUTHENTICATED', 'سجل الدخول للمتابعة.'));
    }
    next();
  };
}
module.exports = requireAuth;
