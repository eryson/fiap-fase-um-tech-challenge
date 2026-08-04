/* eslint-disable no-undef */
module.exports = {
  roots: ['<rootDir>/tests'],
  collectCoverage: false,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/main/**'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  bail: true,
  testTimeout: 15000,
  transform: {
    '.+\\.ts$': [
      'ts-jest',
      {
        isolatedModules: true,
        maxWorkers: 1,
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
}
