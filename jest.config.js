const jestConfig = require('@libs/jest-config-lib');

module.exports = {
  ...jestConfig,
  setupFiles: [],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  preset: 'ts-jest',
  rootDir: './',
  collectCoverageFrom: [
    '<rootDir>/src/**',
    '!src/index.js',
    '!src/config/**',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
