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

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    federation({
      name: '@mf/cyberpunk',
      remotes: {
        '@mf/state': 'http://localhost:7000/assets/remoteEntry.js'
      },
      shared: ['zustand']
    })
  ],
  resolve: {
    alias
  }
});
