module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts'
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/setup.js']
};
