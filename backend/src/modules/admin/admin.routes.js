const { Router } = require('express');
const createAdminService = require('./admin.service');
const createAdminController = require('./admin.controller');
const createAuthService = require('../auth/auth.service');
const { readToken } = require('../../shared/utils/session');
const createHotelProviderRoutes = require('../../providers/hotels/hotel.routes');
const createRestaurantProviderRoutes = require('../../providers/restaurants/restaurant.routes');
const createGuideProviderRoutes = require('../../providers/guides/guide.routes');
const createTransportProviderRoutes = require('../../providers/transport/transport.routes');

function createAdminRoutes(pool, config) {
  const router = Router();
  const adminService = createAdminService(pool);
  const controller = createAdminController(adminService);
  const authService = createAuthService(pool, config);

  router.use(async (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    try {
      const token = readToken(req, config);
      if (token) {
        req.auth = await authService.authenticate(token);
      }
    } catch {
      req.auth = null;
    }
    next();
  });

  // Overview, Reports & Seed
  router.get('/overview', controller.getOverview);
  router.post('/seed', controller.seedDemo);

  // Partners & Applications
  router.get('/providers', controller.getProviders);
  router.post('/providers', controller.createProvider);
  router.patch('/providers/:id', controller.updateProvider);

  // Dedicated Provider Modules (Hotels, Restaurants, Guides, Transport)
  router.use('/provider-modules/hotels', createHotelProviderRoutes(pool));
  router.use('/provider-modules/restaurants', createRestaurantProviderRoutes(pool));
  router.use('/provider-modules/guides', createGuideProviderRoutes(pool));
  router.use('/provider-modules/transport', createTransportProviderRoutes(pool));

  router.get('/applications', controller.getApplications);
  router.patch('/applications/:id/review', controller.reviewApplication);
  router.post('/public/partner-applications', controller.submitPartnerApplication);

  // Users & Access
  router.get('/users', controller.getUsers);
  router.patch('/users/:id', controller.updateUser);

  // Bookings & Disputes
  router.get('/bookings', controller.getBookings);
  router.get('/disputes', controller.getDisputes);
  router.patch('/disputes/:id', controller.updateDispute);

  // Finance: Commissions, Settlements & Payouts
  router.get('/finance', controller.getFinance);
  router.post('/commissions', controller.createCommissionRule);
  router.patch('/commissions/:id', controller.toggleCommissionRule);
  router.patch('/settlements/:id', controller.updateSettlementStatus);
  router.post('/payouts', controller.createPayout);
  router.patch('/payouts/:id', controller.updatePayoutStatus);

  // Catalog, Public Destinations, Audit & Settings
  router.get('/public/destinations', controller.getPublicDestinations);
  router.get('/catalog', controller.getCatalog);
  router.post('/catalog/destinations', controller.createDestination);
  router.patch('/catalog/destinations/:id', controller.updateDestination);
  router.delete('/catalog/destinations/:id', controller.deleteDestination);
  router.patch('/catalog/:entityType/:id', controller.updateCatalogItemStatus);

  router.get('/audit', controller.getAuditLogs);
  router.get('/settings', controller.getSettings);
  router.post('/settings/faqs', controller.createFaqEntry);

  return router;
}

module.exports = createAdminRoutes;
