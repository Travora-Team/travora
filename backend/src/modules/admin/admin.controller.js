function createAdminController(adminService) {
  const wrap = (fn) => async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };

  return {
    getOverview: wrap(async (req, res) => {
      const data = await adminService.getOverview(req.auth?.user?.id);
      res.json({ status: 'success', data });
    }),

    seedDemo: wrap(async (req, res) => {
      const result = await adminService.ensureSeedData(req.auth?.user?.id);
      const data = await adminService.getOverview(req.auth?.user?.id);
      res.json({ status: 'success', message: 'تم تجهيز بيانات لوحة التحكم بنجاح.', data: { ...result, overview: data } });
    }),

    getProviders: wrap(async (req, res) => {
      const providers = await adminService.getProviders(req.query);
      res.json({ status: 'success', data: { providers } });
    }),

    createProvider: wrap(async (req, res) => {
      const provider = await adminService.createProvider(req.body, req.auth?.user?.id);
      res.status(201).json({ status: 'success', message: 'تم إضافة شريك الخدمة بنجاح.', data: { provider } });
    }),

    updateProvider: wrap(async (req, res) => {
      const provider = await adminService.updateProviderStatus(req.params.id, req.body, req.auth?.user?.id);
      res.json({ status: 'success', message: 'تم تحديث بيانات مقدم الخدمة.', data: { provider } });
    }),

    getApplications: wrap(async (req, res) => {
      const applications = await adminService.getApplications(req.query);
      res.json({ status: 'success', data: { applications } });
    }),

    reviewApplication: wrap(async (req, res) => {
      const application = await adminService.reviewApplication(req.params.id, req.body, req.auth?.user?.id);
      res.json({ status: 'success', message: 'تم حفظ قرار مراجعة طلب الشريك بنجاح.', data: { application } });
    }),

    submitPartnerApplication: wrap(async (req, res) => {
      const data = await adminService.submitPublicPartnerApplication(req.body);
      res.status(201).json({
        status: 'success',
        message: 'تم إرسال طلب انضمامك كشريك خدمة إلى إدارة المنصة للمراجعة والاعتماد.',
        data,
      });
    }),

    getUsers: wrap(async (req, res) => {
      const users = await adminService.getUsers(req.query);
      res.json({ status: 'success', data: { users } });
    }),

    updateUser: wrap(async (req, res) => {
      const user = await adminService.updateUser(req.params.id, req.body);
      res.json({ status: 'success', message: 'تم تحديث صلاحيات وحالة المستخدم بنجاح.', data: { user } });
    }),

    getBookings: wrap(async (req, res) => {
      const bookings = await adminService.getBookings(req.query);
      res.json({ status: 'success', data: { bookings } });
    }),

    getDisputes: wrap(async (req, res) => {
      const disputes = await adminService.getDisputes(req.query);
      res.json({ status: 'success', data: { disputes } });
    }),

    updateDispute: wrap(async (req, res) => {
      const dispute = await adminService.updateDispute(req.params.id, req.body, req.auth?.user?.id);
      res.json({ status: 'success', message: 'تم تحديث التذكرة وإرسال الرد بنجاح.', data: { dispute } });
    }),

    getFinance: wrap(async (req, res) => {
      const data = await adminService.getFinance(req.auth?.user?.id);
      res.json({ status: 'success', data });
    }),

    createCommissionRule: wrap(async (req, res) => {
      const rule = await adminService.createCommissionRule(req.body);
      res.status(201).json({ status: 'success', message: 'تم إنشاء قاعدة العمولة الجديدة بنجاح.', data: { rule } });
    }),

    toggleCommissionRule: wrap(async (req, res) => {
      const rule = await adminService.toggleCommissionRule(req.params.id, req.body);
      res.json({ status: 'success', message: 'تم تحديث حالة قاعدة العمولة.', data: { rule } });
    }),

    updateSettlementStatus: wrap(async (req, res) => {
      const settlement = await adminService.updateSettlementStatus(req.params.id, req.body, req.auth?.user?.id);
      res.json({ status: 'success', message: 'تم تحديث حالة التسوية المالية بنجاح.', data: { settlement } });
    }),

    createPayout: wrap(async (req, res) => {
      const payout = await adminService.createPayout(req.body, req.auth?.user?.id);
      res.status(201).json({ status: 'success', message: 'تم إصدار أمر التحويل المالي بنجاح.', data: { payout } });
    }),

    updatePayoutStatus: wrap(async (req, res) => {
      const payout = await adminService.updatePayoutStatus(req.params.id, req.body, req.auth?.user?.id);
      res.json({ status: 'success', message: 'تم تحديث حالة التحويل المالي بنجاح.', data: { payout } });
    }),

    getCatalog: wrap(async (req, res) => {
      const data = await adminService.getCatalog();
      res.json({ status: 'success', data });
    }),

    getPublicDestinations: wrap(async (req, res) => {
      const data = await adminService.getPublicDestinations();
      res.json({ status: 'success', data });
    }),

    createDestination: wrap(async (req, res) => {
      const destination = await adminService.createDestination(req.body);
      res.status(201).json({ status: 'success', message: 'تمت إضافة الوجهة السياحية بنجاح.', data: { destination } });
    }),

    updateDestination: wrap(async (req, res) => {
      const destination = await adminService.updateDestination(req.params.id, req.body);
      res.json({ status: 'success', message: 'تم حفظ تعديلات الوجهة السياحية بنجاح.', data: { destination } });
    }),

    deleteDestination: wrap(async (req, res) => {
      const result = await adminService.deleteDestination(req.params.id);
      res.json({
        status: 'success',
        message: result.archived
          ? 'تمت أرشفة الوجهة وإخفاؤها من الصفحة الرئيسية لارتباطها بخدمات حالية.'
          : 'تم حذف الوجهة السياحية بنجاح.',
        data: result,
      });
    }),

    updateCatalogItemStatus: wrap(async (req, res) => {
      const item = await adminService.updateCatalogItemStatus(req.params.entityType, req.params.id, req.body);
      res.json({ status: 'success', message: 'تم تحديث حالة العنصر في الكتالوج.', data: { item } });
    }),

    getAuditLogs: wrap(async (req, res) => {
      const logs = await adminService.getAuditLogs(req.query);
      res.json({ status: 'success', data: { logs } });
    }),

    getSettings: wrap(async (req, res) => {
      const data = await adminService.getSettings();
      res.json({ status: 'success', data });
    }),

    createFaqEntry: wrap(async (req, res) => {
      const faq = await adminService.createFaqEntry(req.body);
      res.status(201).json({ status: 'success', message: 'تم حفظ السؤال الشائع بنجاح.', data: { faq } });
    }),
  };
}

module.exports = createAdminController;
