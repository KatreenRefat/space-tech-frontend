/**
 * localStorage keys. Kept in one place so a rename can't silently orphan a
 * session — the string values must stay as they are or already-signed-in users
 * get logged out on deploy.
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_TYPE: 'tokenType',
  USER: 'user',
  OTP_PHONE: 'otpPhone',
};
