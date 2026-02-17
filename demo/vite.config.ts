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
});
