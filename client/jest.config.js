module.exports = {
    testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    collectCoverage: true,
    collectCoverageFrom: [
      'controllers/**/*.js',
      'models/**/*.js',
      'client/**/*.js',
      '!**/node_modules/**',
      '!**/dist/**',
      '!client/__tests__/**' // don't collect coverage from test files
    ],
    coverageDirectory: './coverage',
    coverageReporters: ['text', 'lcov'],
    testEnvironment: 'jsdom', // required for DOM testing
    setupFiles: ['<LaFosseAlphaProject>/jest.setup.js']
  };
  