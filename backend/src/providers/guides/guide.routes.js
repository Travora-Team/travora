const { Router } = require('express');
const createGuideProviderService = require('./guide.service');
const createGuideProviderController = require('./guide.controller');

function createGuideProviderRoutes(pool) {
  const router = Router();
  const service = createGuideProviderService(pool);
  const controller = createGuideProviderController(service);

  router.get('/', controller.listGuides);
  router.get('/dashboard', controller.getDashboard);
  router.post('/tours', controller.addGuidedTour);
  router.patch('/:id/status', controller.updateGuideStatus);

  return router;
}

module.exports = createGuideProviderRoutes;
