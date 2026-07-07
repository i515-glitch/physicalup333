import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/static/',
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'app/static'),
    emptyOutDir: false, // CRITICAL: Protects other static files (like report.html, admin.html) from deletion!
  }
})
