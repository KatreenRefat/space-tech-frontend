import { httpClient } from './httpClient.js';

/**
 * Phone + OTP authentication.
 *
 * Endpoints under /public/ are unauthenticated, so they skip the Authorization
 * header — sending a stale token there only invites a pointless 401.
 */
export const authService = {
  /** Send a one-time code to `phone` (E.164, see utils/phone.js). */
  requestOtp: (phone) => httpClient.post('/public/auth/request-otp', { phone }, { auth: false }),

  /** Exchange a code for tokens. Resolves to `{ data: { tokens, user, ... } }`. */
  verifyOtp: (phone, otpCode) =>
    httpClient.post('/public/auth/verify-otp', { phone, otpCode }, { auth: false }),

  /**
   * Manual token refresh. Routine refreshing is handled inside httpClient on
   * any 401 — call this only when you need to force one.
   */
  refresh: (refreshToken) =>
    httpClient.post('/public/auth/refresh', { refreshToken }, { auth: false }),
};

export default authService;
