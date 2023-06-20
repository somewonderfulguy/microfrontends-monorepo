// TODO: test https://www.npmjs.com/package/jest-styled-components
// TODO: add snapshot-diff
// TODO: short snapshot eslint rule
// TODO: fix react dom issues
// TODO: fix React 18 warning

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsconfig = require('./tsconfig.json')

const { paths } = tsconfig.compilerOptions
const aliases = Object.keys(paths).reduce((acc, key) => {
  const keyWithoutStar = key.replace('*', '')
  const value = paths[key][0].replace('*', '')
  return {
    ...acc,
    // regex explanation:
    // (.*)$: capture whatever comes after the exact match (the directory)
    // $1: map it to this value in the directory specified
    [`^${keyWithoutStar}(.*)$`]: `<rootDir>/src/${value}$1`
  }
}, {})

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
    // TODO: test it all (css|less|scss|sass)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    ...aliases
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
