import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import federation from '@originjs/vite-plugin-federation';

export const alias = {
  // keep in alphabetical order
  '~api': '/src/api',
  '~components': '/src/components',
  '~contexts': '/src/contexts',
  '~hooks': '/src/hooks',
  '~tests': '/src/tests',
  '~utils': '/src/utils'
};

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
  ],
  resolve: {
    alias
  },
  build: {
    target: 'es2022'
  }
}));
