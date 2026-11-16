function createPartnerRegisterController(partnerRegisterService) {
  return {
    submitApplication: async (req, res, next) => {
      try {
        const data = await partnerRegisterService.submitPublicPartnerApplication(req.body);
        res.status(201).json({
          status: 'success',
          message: 'تم إرسال طلب انضمامك كشريك خدمة إلى إدارة المنصة للمراجعة والاعتماد.',
          data,
        });
      } catch (err) {
        next(err);
      }
    },
  };
}

module.exports = createPartnerRegisterController;
