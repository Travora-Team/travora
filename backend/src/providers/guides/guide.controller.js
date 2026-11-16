function createGuideProviderController(guideService) {
  return {
    listGuides: async (req, res, next) => {
      try {
        const guides = await guideService.listGuides(req.query);
        res.json({ status: 'success', data: { guides } });
      } catch (err) {
        next(err);
      }
    },

    getDashboard: async (req, res, next) => {
      try {
        const dashboard = await guideService.getGuideDashboard({
          providerId: req.query.providerId,
          userId: req.query.userId,
        });
        res.json({ status: 'success', data: dashboard });
      } catch (err) {
        next(err);
      }
    },

    addGuidedTour: async (req, res, next) => {
      try {
        const tour = await guideService.addGuidedTour(req.body);
        res.status(201).json({
          status: 'success',
          message: 'تمت إضافة المسار / الجولة الإرشادية إلى جدول أعمالك بنجاح.',
          data: { tour },
        });
      } catch (err) {
        next(err);
      }
    },

    updateGuideStatus: async (req, res, next) => {
      try {
        const guide = await guideService.updateGuideStatus(req.params.id, req.body.status);
        res.json({ status: 'success', message: 'تم تحديث حالة المرشد السياحي بنجاح.', data: { guide } });
      } catch (err) {
        next(err);
      }
    },
  };
}

module.exports = createGuideProviderController;
