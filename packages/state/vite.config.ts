import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: '@mf/state',
      filename: 'remoteEntry.js',
      exposes: {
        './themeStore': './stores/themeStore.ts'
      },
      shared: ['zustand']
    })
  ],
  build: {
    target: 'esnext',
    copyPublicDir: false
  }
})
