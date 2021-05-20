// Configuring console messages to run silently while testing with jest
// https://medium.com/swlh/6-ways-to-run-jest-test-cases-silently-67d2fead8c11
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
