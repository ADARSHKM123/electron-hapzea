import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: path.resolve('src/renderer'),
  base: './',
  build: {
    outDir: path.resolve('out/renderer'),
    emptyOutDir: true
  }
});