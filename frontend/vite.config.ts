import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/MyWebsite/', // for GitHub Pages deployment
  build: {
    outDir: 'build' // to match your deploy script
  },
  server: {
    port: 3000,
    open: true
  }
})