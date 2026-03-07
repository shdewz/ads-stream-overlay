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
  root: 'src/graphics',
  base: '/bundles/overlay/graphics/',
  build: {
    outDir: resolve(__dirname, 'graphics'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        'main/index':     resolve(__dirname, 'src/graphics/main/index.html'),
        'mappool/index':  resolve(__dirname, 'src/graphics/mappool/index.html'),
        'intro/index':    resolve(__dirname, 'src/graphics/intro/index.html'),
      },
    },
  },
});
