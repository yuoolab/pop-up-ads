import { defineConfig } from 'vite';

export default defineConfig({
  base: '/pop-up-ads/',
  server: {
    host: true,
    port: 5173
  },
  preview: {
    host: true,
    port: 5173
  }
});
