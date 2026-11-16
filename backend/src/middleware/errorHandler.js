const ApiError = require('../utils/ApiError');
const connectionErrors = new Set(['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', '57P01', '57P02', '57P03', '53300']);
function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.type === 'entity.parse.failed') error = new ApiError(400, 'INVALID_JSON', 'محتوى JSON غير صحيح.');
  else if (error.type === 'entity.too.large') error = new ApiError(413, 'PAYLOAD_TOO_LARGE', 'حجم الطلب أكبر من المسموح.');
  else if (error.type === 'charset.unsupported' || error.type === 'encoding.unsupported') {
    error = new ApiError(415, 'UNSUPPORTED_MEDIA_TYPE', 'ترميز الطلب غير مدعوم.');
  } else if (connectionErrors.has(error.code) || error.code?.startsWith('08')) {
    error = new ApiError(503, 'DATABASE_UNAVAILABLE', 'الاتصال بقاعدة البيانات غير متاح مؤقتًا.');
  }
  if (!(error instanceof ApiError)) {
    console.error('Unexpected request error', { name: error.name, code: error.code });
    error = new ApiError(500, 'INTERNAL_ERROR', 'حدث خطأ داخلي.');
  }
  const result = { code: error.code, message: error.message };
  if (error.details) result.details = error.details;
  res.status(error.status).json({ status: 'error', error: result });
}
module.exports = errorHandler;
