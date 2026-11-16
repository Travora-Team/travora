import { adminApi } from '../../../shared/api/adminApi';

export const homeApi = {
  getPublicDestinations: () => adminApi.getPublicDestinations(),
};
