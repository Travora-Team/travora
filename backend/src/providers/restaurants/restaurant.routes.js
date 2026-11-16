const { Router } = require('express');
const createRestaurantProviderService = require('./restaurant.service');
const createRestaurantProviderController = require('./restaurant.controller');

function createRestaurantProviderRoutes(pool) {
  const router = Router();
  const service = createRestaurantProviderService(pool);
  const controller = createRestaurantProviderController(service);

  router.get('/', controller.listRestaurants);
  router.get('/dashboard', controller.getDashboard);
  router.post('/menu-items', controller.addMenuItem);
  router.patch('/:id/status', controller.updateRestaurantStatus);

  return router;
}

module.exports = createRestaurantProviderRoutes;
