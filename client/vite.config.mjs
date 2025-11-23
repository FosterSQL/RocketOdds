import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// target server port (the Express server uses 4000 by default)
const { PORT = 4000 } = process.env

export default defineConfig({
  plugins: [react()],
  base: '/RocketOdds/',
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
      },
      '/auth': {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: './src/main.jsx',
    },
  },
})
