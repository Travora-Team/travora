function createRestaurantProviderController(restaurantService) {
  return {
    listRestaurants: async (req, res, next) => {
      try {
        const restaurants = await restaurantService.listRestaurants(req.query);
        res.json({ status: 'success', data: { restaurants } });
      } catch (err) {
        next(err);
      }
    },

    getDashboard: async (req, res, next) => {
      try {
        const dashboard = await restaurantService.getRestaurantDashboard({
          providerId: req.query.providerId,
          userId: req.query.userId,
        });
        res.json({ status: 'success', data: dashboard });
      } catch (err) {
        next(err);
      }
    },

    addMenuItem: async (req, res, next) => {
      try {
        const menuItem = await restaurantService.addMenuItem(req.body);
        res.status(201).json({
          status: 'success',
          message: 'تمت إضافة الطبق / باقة الضيافة إلى قائمة المطعم بنجاح.',
          data: { menuItem },
        });
      } catch (err) {
        next(err);
      }
    },

    updateRestaurantStatus: async (req, res, next) => {
      try {
        const restaurant = await restaurantService.updateRestaurantStatus(req.params.id, req.body.status);
        res.json({ status: 'success', message: 'تم تحديث حالة المطعم بنجاح.', data: { restaurant } });
      } catch (err) {
        next(err);
      }
    },
  };
}

module.exports = createRestaurantProviderController;
