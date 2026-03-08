import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  root: 'src/panels',
  base: '/bundles/overlay/dashboard/',
  build: {
    outDir: resolve(__dirname, 'dashboard'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        'controlpanel/index': resolve(__dirname, 'src/panels/controlpanel/index.html'),
      },
    },
  },
});
