import { defineConfig } from 'vite';
import { builtinModules } from 'module';

export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        ...builtinModules,
        'electron',
        'keytar',
        '@getstation/electron-google-oauth2',
       'dotenv'            
      ]
    }
  }
});
