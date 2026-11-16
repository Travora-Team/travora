import { adminApi } from '../../../shared/api/adminApi';

export const partnerRegisterApi = {
  getPublicDestinations: () => adminApi.getPublicDestinations(),
  submitPartnerApplication: (payload) => adminApi.submitPartnerApplication(payload),
};
