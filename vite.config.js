import { copyFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

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

export default defineConfig(({ command }) => ({
  base: command === 'build' ? BASE : '/',
  plugins: [react(), tailwindcss(), spaFallback()],
  server: {
    proxy: {
      '/api': {
        target: 'https://back.markwasfy00.xyz',
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));
