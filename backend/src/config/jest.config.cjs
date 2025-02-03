// src/config/jest.config.cjs
console.log("Using my custom Jest config");

const config = {
  // Set rootDir to your project root directory.
  rootDir: "../../", // This makes <rootDir> equal to "C:\Users\moham\OneDrive\Desktop\action\backend"
  
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Update roots to point to the correct location of your test files.
  roots: ['<rootDir>/src/tests'],
  
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'mjs', 'cjs'],
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
      useESM: true,
    },
  },
  
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  
  // Let Jest treat TypeScript files as ES modules.
  extensionsToTreatAsEsm: ['.ts'],
  
  // Map .js imports to .ts files.
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1.ts',
  },
};

module.exports = config;
