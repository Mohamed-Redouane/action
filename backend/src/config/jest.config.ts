import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', 
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'], 
  testMatch: ['**/*.test.ts'], 
  moduleFileExtensions: ['ts', 'js'],
  moduleDirectories: ['node_modules', 'src'],
  setupFiles: ['dotenv/config'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.mts', 
    '!src/config/**', 
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'], 
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json', 
    },
  },
};

export default config;
