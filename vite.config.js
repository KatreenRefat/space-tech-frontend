import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://back.markwasfy00.xyz',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});