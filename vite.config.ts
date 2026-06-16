import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The project lives in an iCloud path that contains spaces, so decode the
// file URL to get a usable absolute path for the "@" alias.
const srcPath = decodeURIComponent(new URL('./src', import.meta.url).pathname)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': srcPath,
    },
  },
})
