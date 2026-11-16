import { authApi } from '../../../shared/api/authApi';

export const loginApi = {
  initiateLoginOtp: (payload) => authApi.initiateLoginOtp(payload),
  loginDirect: (payload) => authApi.loginDirect(payload),
};
