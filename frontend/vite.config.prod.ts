import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production configuration - with GitHub Pages base path
export default defineConfig({
  plugins: [react()],
  base: '/MyWebsite/', // for GitHub Pages deployment
  build: {
    outDir: 'build'
  },
  server: {
    port: 3000,
    open: true
  }
})