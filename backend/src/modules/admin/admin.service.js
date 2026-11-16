const createAdminSeedService = require('./services/adminSeed.service');
const createAdminOverviewService = require('./services/adminOverview.service');
const createAdminOperationsService = require('./services/adminOperations.service');
const createAdminFinanceService = require('./services/adminFinance.service');
const createAdminCatalogService = require('./services/adminCatalog.service');
const createPartnerRegisterService = require('../partner-register/partnerRegister.service');

/**
 * Modular Admin Service Orchestrator
 * Composes focused sub-services for Overview, Operations, Finance, Catalog, and Partner Registration.
 */
function createAdminService(pool) {
  const seedService = createAdminSeedService(pool);
  const overviewService = createAdminOverviewService(pool, seedService);
  const operationsService = createAdminOperationsService(pool, seedService);
  const financeService = createAdminFinanceService(pool, seedService);
  const catalogService = createAdminCatalogService(pool, seedService);
  const partnerRegisterService = createPartnerRegisterService(pool, seedService);

  return {
    ...seedService,
    ...overviewService,
    ...operationsService,
    ...financeService,
    ...catalogService,
    ...partnerRegisterService,
  };
}

module.exports = createAdminService;
