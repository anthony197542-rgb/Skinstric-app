import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/skinstric-api': {
        target: 'https://us-central1-frontend-simplified.cloudfunctions.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/skinstric-api/, ''),
      },
    },
  },
});
