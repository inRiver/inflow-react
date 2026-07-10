import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this project from https://<user>.github.io/inflow-react/,
  // a subpath, not the domain root. Set GITHUB_PAGES=true only in the Pages
  // deploy workflow; local dev and other hosting targets keep base at '/'.
  base: process.env.GITHUB_PAGES === 'true' ? '/inflow-react/' : '/',
})
