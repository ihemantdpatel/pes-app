module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.ts'], // Ensure the correct path
  verbose: true,
  clearMocks: true,
  testTimeout: 10000, // Increases timeout globally to 10 seconds
};