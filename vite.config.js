import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VitePWA({

    includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],  
    manifest: {
      name: 'Trellox',
      short_name: 'Trellox',
      description: 'Productive Application for managing projects and orginizing missions',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'src/assets/images/icon192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'src/assets/images/icon512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'src/assets/images/icon512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        }
      ]
    }
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: '../backend/public',
    emptyOutDir: true
  }
})
