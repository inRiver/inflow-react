import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for the showcase app when deployed to GitHub Pages under the
  // repository name. For local development and other hosts at domain root,
  // Vite treats '/' as root and assets are loaded with relative paths.
  base: process.env.VITE_BASE_URL || '/',
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/vitest.setup.ts'],
  },
})
