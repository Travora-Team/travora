const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const createAuthRoutes = require('./modules/auth/auth.routes');
const createAdminRoutes = require('./modules/admin/admin.routes');
const createPartnerRegisterRoutes = require('./modules/partner-register/partnerRegister.routes');
const createHotelProviderRoutes = require('./providers/hotels/hotel.routes');
const createRestaurantProviderRoutes = require('./providers/restaurants/restaurant.routes');
const createGuideProviderRoutes = require('./providers/guides/guide.routes');
const createTransportProviderRoutes = require('./providers/transport/transport.routes');
const ApiError = require('./shared/utils/ApiError');
const errorHandler = require('./shared/middleware/errorHandler');

function createApp({ pool, config }) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', config.trustProxyHops);
  app.use(helmet({ strictTransportSecurity: config.secureCookies ? undefined : false }));
  app.use((req, res, next) => {
    const origin = req.get('Origin');
    if (
      (origin && !config.allowedOrigins.includes(origin)) ||
      (!origin && req.get('Sec-Fetch-Site') === 'cross-site')
    ) {
      return next(new ApiError(403, 'ORIGIN_NOT_ALLOWED', 'مصدر الطلب غير مسموح به.'));
    }
    next();
  });
  app.use(
    cors({
      origin: (origin, callback) =>
        callback(null, Boolean(origin && config.allowedOrigins.includes(origin))),
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type'],
      maxAge: 600,
    })
  );
  app.use(express.json({ limit: '16kb' }));
  app.use(cookieParser());

  app.get('/api/health', async (req, res) => {
    res.set('Cache-Control', 'no-store');
    try {
      await pool.query('SELECT 1');
      res.json({ status: 'success', data: { database: 'connected' } });
    } catch {
      throw new ApiError(503, 'DATABASE_UNAVAILABLE', 'الاتصال بقاعدة البيانات غير متاح مؤقتًا.');
    }
  });

  // Screen Modules
  app.use('/api/auth', createAuthRoutes(pool, config));
  app.use('/api/admin', createAdminRoutes(pool, config));
  app.use('/api/partner-register', createPartnerRegisterRoutes(pool));

  // Service Provider Modules
  app.use('/api/providers/hotels', createHotelProviderRoutes(pool));
  app.use('/api/providers/restaurants', createRestaurantProviderRoutes(pool));
  app.use('/api/providers/guides', createGuideProviderRoutes(pool));
  app.use('/api/providers/transport', createTransportProviderRoutes(pool));

  app.use((req, res, next) => next(new ApiError(404, 'NOT_FOUND', 'المسار غير موجود.')));
  app.use(errorHandler);
  return app;
}

module.exports = createApp;
