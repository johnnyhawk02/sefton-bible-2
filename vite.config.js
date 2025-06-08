import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { contentPlugin } from './vite-plugins/content-plugin.js'
import { generateContentManifest } from './vite-plugins/manifest-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), contentPlugin(), generateContentManifest()],
  base: './',
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      },
    },
  },
})
