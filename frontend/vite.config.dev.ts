import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Development configuration - no base path for local development
export default defineConfig({
  plugins: [react()],
  // No base path for development - serves from root
  build: {
    outDir: 'build'
  },
  server: {
    port: 3000,
    open: true,
    host: true // Allow external connections
  }
})