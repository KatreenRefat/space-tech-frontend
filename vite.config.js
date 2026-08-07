import { copyFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { API_PROXY_PATH, DEFAULT_API_ORIGIN } from './src/config/api.js';

// GitHub Pages serves this repo from https://sla7ly-org.github.io/space-tech-frontend/
// so the production build needs that prefix on every asset URL. Dev stays at '/'
// to keep `npm run dev` reachable at plain http://localhost:5173/.
const BASE = '/space-tech-frontend/';

// GitHub Pages has no SPA rewrite: a hard refresh on /auth/login would 404.
// Serving a copy of index.html as 404.html makes Pages hand back the app for any
// unknown path, and React Router then resolves the real route client-side.
function spaFallback() {
  let outDir;
  return {
    name: 'spa-fallback-404',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const index = join(outDir, 'index.html');
      if (existsSync(index)) {
        copyFileSync(index, join(outDir, '404.html'));
      }
    },
  };
}

export default defineConfig(({ command, mode }) => {
  // Same variable the app reads in src/config/env.js, so the dev proxy and the
  // runtime base URL can never point at different backends.
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const apiOrigin = env.VITE_API_ORIGIN || DEFAULT_API_ORIGIN;

  return {
    base: command === 'build' ? BASE : '/',
    plugins: [react(), tailwindcss(), spaFallback()],
    resolve: {
      alias: {
        // Import from '@/services/...' instead of counting '../../..' hops.
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        // Dev calls stay same-origin and get forwarded here, which sidesteps CORS.
        [API_PROXY_PATH]: {
          target: apiOrigin,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
