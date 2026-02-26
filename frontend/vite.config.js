import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true, // Allows Docker to expose it
    port: 5173,
    proxy: {
      "/api": {
        target: "http://app:3000", // Points to the backend service
        changeOrigin: true,
        secure: false,
      }
    }
  }
})