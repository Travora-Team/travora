const { Router } = require('express');
const createTransportProviderService = require('./transport.service');
const createTransportProviderController = require('./transport.controller');

function createTransportProviderRoutes(pool) {
  const router = Router();
  const service = createTransportProviderService(pool);
  const controller = createTransportProviderController(service);

  router.get('/', controller.listTransportServices);
  router.get('/dashboard', controller.getDashboard);
  router.post('/vehicles', controller.addVehicleService);
  router.patch('/:id/status', controller.updateTransportStatus);

  return router;
}

module.exports = createTransportProviderRoutes;
