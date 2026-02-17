import { defineConfig } from 'tsup';
import { cpSync } from 'fs';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'recharts', '@phosphor-icons/react'],
  treeshake: true,
  onSuccess: async () => {
    cpSync('src/styles', 'dist/styles', { recursive: true });
  },
});
