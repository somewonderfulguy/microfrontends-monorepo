import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import federation from '@originjs/vite-plugin-federation'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    svgr(),
    federation({
      remotes: {
        '@mf/state':
          mode === 'production'
            ? 'https://cyberpunk-mf-state.vercel.app/assets/remoteEntry.js'
            : 'http://localhost:7000/assets/remoteEntry.js'
      },
      shared: ['react', 'react-dom']
    })
  ]
}))
