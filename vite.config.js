import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      exportAsDefault: false,
    }),
  ],
  server: {
    port: 3000,
    allowedHosts: ['https://685727d3ba9823fa40b128f3--fitboxing-admin.netlify.app/']
  }
});