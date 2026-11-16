const { Router } = require('express');
const createHotelProviderService = require('./hotel.service');
const createHotelProviderController = require('./hotel.controller');

function createHotelProviderRoutes(pool) {
  const router = Router();
  const service = createHotelProviderService(pool);
  const controller = createHotelProviderController(service);

  router.get('/', controller.listHotels);
  router.get('/dashboard', controller.getDashboard);
  router.post('/rooms', controller.createRoomType);
  router.patch('/:id/status', controller.updateHotelStatus);

  return router;
}

module.exports = createHotelProviderRoutes;
