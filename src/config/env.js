import { API_PREFIX, DEFAULT_API_ORIGIN } from './api.js';

/** Strip any trailing slashes so joining with API_PREFIX never doubles up. */
function trimTrailingSlash(url) {
  return url.trim().replace(/\/+$/, '');
}

/**
 * Backend origin for this build. Override per environment with VITE_API_ORIGIN
 * in .env.local (see .env.example); vite.config.js reads the same variable for
 * the dev proxy, so both ends always agree on the domain.
 */
export const API_ORIGIN = trimTrailingSlash(import.meta.env.VITE_API_ORIGIN || DEFAULT_API_ORIGIN);

/**
 * Base URL every request is built on.
 *
 * Dev keeps it relative so calls go through the Vite proxy on the same origin —
 * no CORS, no preflight. Production builds are served from a static host with no
 * proxy (GitHub Pages), so they need the absolute URL and the backend has to
 * allow the Pages origin via CORS.
 */
export const API_BASE_URL = import.meta.env.DEV ? API_PREFIX : `${API_ORIGIN}${API_PREFIX}`;

export const IS_DEV = import.meta.env.DEV;
