const { Router } = require('express');
const createPartnerRegisterService = require('./partnerRegister.service');
const createPartnerRegisterController = require('./partnerRegister.controller');

function createPartnerRegisterRoutes(pool, deps = {}) {
  const router = Router();
  const service = createPartnerRegisterService(pool, deps);
  const controller = createPartnerRegisterController(service);

  router.post('/applications', controller.submitApplication);

  return router;
}

module.exports = createPartnerRegisterRoutes;
