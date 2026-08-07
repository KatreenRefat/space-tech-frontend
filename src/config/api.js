/**
 * The one place the backend lives.
 *
 * Nothing else in the repo may hardcode the API host — the runtime HTTP client
 * (src/services/httpClient.js) and the dev proxy (vite.config.js) both read it
 * from here, so a backend move is a one-line change.
 *
 * This file is imported by vite.config.js as well, which runs in Node: keep it
 * free of `import.meta.env` and of anything browser-specific.
 */

/** Backend origin used when no VITE_API_ORIGIN override is provided. */
export const DEFAULT_API_ORIGIN = 'https://back.markwasfy00.xyz';

/** Version prefix every endpoint hangs off. */
export const API_PREFIX = '/api/v1';

/** Path the dev server proxies to the backend (broader than API_PREFIX on purpose). */
export const API_PROXY_PATH = '/api';

/** Requests that take longer than this are treated as a network failure. */
export const API_TIMEOUT_MS = 30_000;
