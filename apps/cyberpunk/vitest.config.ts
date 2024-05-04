import { defineConfig } from 'vitest/config';

import { alias } from './vite.config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['@testing-library/jest-dom']
  },
  resolve: {
    alias
  }
});
