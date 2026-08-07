import { STORAGE_KEYS } from '@/constants/storageKeys.js';

/**
 * Session storage helpers.
 *
 * Every read/write of the auth tokens goes through here so the shape of what we
 * persist is defined once. localStorage throws in private-mode Safari and when
 * quota is exhausted, so writes are best-effort rather than fatal.
 */

function read(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage unavailable (private mode / quota) — the session just won't persist.
  }
}

function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Nothing to do.
  }
}

export const getAccessToken = () => read(STORAGE_KEYS.ACCESS_TOKEN);
export const getRefreshToken = () => read(STORAGE_KEYS.REFRESH_TOKEN);
export const getTokenType = () => read(STORAGE_KEYS.TOKEN_TYPE) || 'Bearer';

/** Ready-to-use `Authorization` header value, or null when signed out. */
export function getAuthorizationHeader() {
  const token = getAccessToken();
  return token ? `${getTokenType()} ${token}` : null;
}

/** Persist the token trio returned by the auth endpoints. */
export function saveTokens(tokens) {
  if (!tokens?.accessToken) return;
  write(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
  if (tokens.refreshToken) write(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  write(STORAGE_KEYS.TOKEN_TYPE, tokens.tokenType || 'Bearer');
}

export function getUser() {
  const raw = read(STORAGE_KEYS.USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveUser(user) {
  if (!user) return;
  write(STORAGE_KEYS.USER, JSON.stringify(user));
}

/** Phone number carried between the phone screen and the OTP screen. */
export const getOtpPhone = () => read(STORAGE_KEYS.OTP_PHONE);
export const saveOtpPhone = (phone) => write(STORAGE_KEYS.OTP_PHONE, phone);
export const clearOtpPhone = () => remove(STORAGE_KEYS.OTP_PHONE);

/** Wipe everything auth-related — used on sign-out and on a dead refresh token. */
export function clearSession() {
  [
    STORAGE_KEYS.ACCESS_TOKEN,
    STORAGE_KEYS.REFRESH_TOKEN,
    STORAGE_KEYS.TOKEN_TYPE,
    STORAGE_KEYS.USER,
    STORAGE_KEYS.OTP_PHONE,
  ].forEach(remove);
}
