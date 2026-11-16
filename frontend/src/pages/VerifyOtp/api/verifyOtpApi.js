import { authApi } from '../../../shared/api/authApi';

export const verifyOtpApi = {
  verifyOtp: (payload) => authApi.verifyOtp(payload),
  resendOtp: (payload) => authApi.resendOtp(payload),
};
