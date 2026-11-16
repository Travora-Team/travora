class ApiError extends Error {
  constructor(status, code, message, details) {
    if (message === undefined && typeof code === 'string') {
      message = code;
      code = status === 400 ? 'VALIDATION_ERROR'
           : status === 401 ? 'UNAUTHORIZED'
           : status === 403 ? 'FORBIDDEN'
           : status === 404 ? 'NOT_FOUND'
           : status === 409 ? 'CONFLICT'
           : status === 429 ? 'RATE_LIMITED'
           : status === 502 ? 'BAD_GATEWAY'
           : status === 503 ? 'DATABASE_UNAVAILABLE'
           : 'INTERNAL_ERROR';
    }
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
module.exports = ApiError;
