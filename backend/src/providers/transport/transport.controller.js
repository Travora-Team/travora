function createTransportProviderController(transportService) {
  return {
    listTransportServices: async (req, res, next) => {
      try {
        const transportServices = await transportService.listTransportServices(req.query);
        res.json({ status: 'success', data: { transportServices } });
      } catch (err) {
        next(err);
      }
    },

    getDashboard: async (req, res, next) => {
      try {
        const dashboard = await transportService.getTransportDashboard({
          providerId: req.query.providerId,
          userId: req.query.userId,
          subtype: req.query.subtype,
        });
        res.json({ status: 'success', data: dashboard });
      } catch (err) {
        next(err);
      }
    },

    addVehicleService: async (req, res, next) => {
      try {
        const vehicle = await transportService.addVehicleService(req.body);
        res.status(201).json({
          status: 'success',
          message: 'تمت إضافة السيارة / خدمة النقل السياحي إلى أسطولك بنجاح.',
          data: { vehicle },
        });
      } catch (err) {
        next(err);
      }
    },

    updateTransportStatus: async (req, res, next) => {
      try {
        const transportServiceItem = await transportService.updateTransportStatus(req.params.id, req.body.status);
        res.json({
          status: 'success',
          message: 'تم تحديث حالة خدمة النقل بنجاح.',
          data: { transportService: transportServiceItem },
        });
      } catch (err) {
        next(err);
      }
    },
  };
}

module.exports = createTransportProviderController;
