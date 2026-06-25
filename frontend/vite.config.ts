import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [react()],
    base: isProduction ? '/MyWebsite/' : '/', // GitHub Pages base only for production
    build: {
      outDir: 'build'
    },
    server: {
      port: 3000,
      open: true,
      host: true // Allow external connections
    }
  }
})
