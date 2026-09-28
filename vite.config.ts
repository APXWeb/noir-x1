import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  // GitHub Pages serves the site from /<repo>/; local dev and preview stay at /.
  base: process.env.PAGES_BASE ?? '/',
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    target: 'es2022',
    rollupOptions: {
      input: { main: 'index.html' },
      output: {
        // React stays with the app; three + R3F load only with the lazy stage.
        manualChunks(id) {
          const m = id.split('\\').join('/')
          if (/node_modules\/(react|react-dom|scheduler|zustand)\//.test(m)) return 'react'
          if (/node_modules\/(three|three-stdlib|@react-three|maath|meshline|troika|camera-controls|@monogrid|stats)/.test(m)) return 'three'
          if (/node_modules\/(gsap|lenis)\//.test(m)) return 'motion'
        },
      },
    },
  },
})
