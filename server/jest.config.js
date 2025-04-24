module.exports = {
  testEnvironment: 'node',
  testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverage: true,
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    '!**/node_modules/**',
    '!**/dist/**'
  ],
  coverageDirectory: '../coverage',
  coverageReporters: ['text', 'lcov'],
};