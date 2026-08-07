import { API_TIMEOUT_MS } from '@/config/api.js';
import { API_BASE_URL } from '@/config/env.js';
import {
  clearSession,
  getAuthorizationHeader,
  getRefreshToken,
  saveTokens,
} from '@/utils/storage.js';

/**
 * The single HTTP client. Every call to the backend goes through `request()` —
 * do not call `fetch` directly from a component, or the base URL, the auth
 * header and the token-refresh retry all have to be reinvented per caller.
 */

/** Error thrown for any non-2xx response, carrying the parsed body. */
export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  /** Field-level validation errors as sent in `error.details`. */
  get details() {
    return this.data?.error?.details ?? [];
  }
}

/** Error thrown when the request never reached the server (offline, DNS, timeout). */
export class NetworkError extends Error {
  constructor(message = 'مشكلة في الاتصال بالسيرفر') {
    super(message);
    this.name = 'NetworkError';
  }
}

function buildBody(body) {
  // FormData must be passed through untouched: the browser has to set
  // Content-Type itself so the multipart boundary is included.
  if (body === undefined || body === null) return { body: undefined, headers: {} };
  if (body instanceof FormData || typeof body === 'string') {
    return { body, headers: {} };
  }
  return {
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  };
}

async function parseBody(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function rawRequest(endpoint, { method = 'GET', body, headers = {}, auth = true, signal }) {
  const built = buildBody(body);
  const requestHeaders = { Accept: 'application/json', ...built.headers, ...headers };

  if (auth) {
    const authorization = getAuthorizationHeader();
    if (authorization) requestHeaders.Authorization = authorization;
  }

  // Abort on timeout so a hung backend doesn't leave the UI spinning forever.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  if (signal) signal.addEventListener('abort', () => controller.abort(), { once: true });

  try {
    return await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: built.body,
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw new NetworkError('السيرفر أخد وقت طويل، حاول تاني');
    throw new NetworkError();
  } finally {
    clearTimeout(timeout);
  }
}

// Concurrent 401s must not fire one refresh call each — they all await this
// single in-flight promise instead.
let refreshInFlight = null;

function refreshTokens() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return Promise.resolve(false);

  refreshInFlight ??= (async () => {
    try {
      const response = await rawRequest('/public/auth/refresh', {
        method: 'POST',
        body: { refreshToken },
        auth: false,
      });
      if (!response.ok) return false;

      const payload = await parseBody(response);
      const tokens = payload?.data?.tokens;
      if (!tokens?.accessToken) return false;

      saveTokens(tokens);
      return true;
    } catch {
      return false;
    } finally {
      // Released on the next tick so every waiter reads the same result first.
      setTimeout(() => {
        refreshInFlight = null;
      }, 0);
    }
  })();

  return refreshInFlight;
}

/**
 * Perform an API request against {@link API_BASE_URL}.
 *
 * A 401 triggers one silent refresh-and-retry; if the refresh token is dead too
 * the session is cleared and the ApiError propagates so the caller can send the
 * user back to sign-in.
 *
 * @param {string} endpoint path below the API prefix, e.g. `/public/categories`
 * @param {object} [options]
 * @param {string} [options.method]
 * @param {object|FormData|string} [options.body] plain objects are JSON-encoded
 * @param {object} [options.headers]
 * @param {boolean} [options.auth] send the Authorization header (default true)
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<any>} the parsed response body
 */
export async function request(endpoint, options = {}) {
  let response = await rawRequest(endpoint, options);

  if (response.status === 401 && options.auth !== false) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      response = await rawRequest(endpoint, options);
    } else {
      clearSession();
    }
  }

  const data = await parseBody(response);

  if (!response.ok) {
    const message = data?.error?.message || data?.message || `Server error ${response.status}`;
    throw new ApiError(message, { status: response.status, data });
  }

  return data;
}

export const httpClient = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body }),
  patch: (endpoint, body, options) => request(endpoint, { ...options, method: 'PATCH', body }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};

export default httpClient;
