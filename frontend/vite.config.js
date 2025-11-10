import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173, // new port for dev server
    proxy: {
      // Proxy API requests to the nginx proxy (frontend/backend) on host port 8080
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },

})
