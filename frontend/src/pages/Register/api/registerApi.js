import { authApi } from '../../../shared/api/authApi';

export const registerApi = {
  registerTraveler: (payload) => authApi.register(payload),
};
