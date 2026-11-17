import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5174,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@fn-crud': fileURLToPath(new URL('../../fn-crud/src/crud', import.meta.url)),
    },
  },
})
