// TODO: test https://www.npmjs.com/package/jest-styled-components
// TODO: test https://emotion.sh/docs/@emotion/jest
// TODO: add snapshot-diff
// TODO: short snapshot eslint rule
// TODO: fix react dom issues
// TODO: styled-components support
// TODO: support aliases
// TODO: fix React 18 warning
// TODO: coverage

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['./src'],
  setupFilesAfterEnv: ['./src/tests/config/setupTests.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testPathIgnorePatterns: [
    'node_modules/',
    '__tests__/TestComponent',
    '__tests__/TestComponents',
    '__tests__/testHooks'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    // TODO: test it all
    '^.+\\.(jpg|svg|ico|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)?$':
      './src/tests/config/fileTransform.js'
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  testMatch: ['**/*.test.(ts|tsx)'],
  moduleNameMapper: {
    // TODO: test it all
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  coveragePathIgnorePatterns: [
    'testHooks',
    'TestComponent',
    'src/index.ts',
    'src/indexReal.tsx',
    'src/App.tsx',
    'src/typesShared.ts',
    '.stories.tsx'
  ],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10
    }
  }
}
