import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/vitro/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@circle-oo/vitro': path.resolve(__dirname, '../src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/recharts') || id.includes('node_modules/victory-vendor')) {
            return 'vendor-recharts';
          }
        },
      },
    },
  },
});
