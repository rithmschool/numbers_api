// Configuring console messages to run silently while testing with jest
// https://medium.com/swlh/6-ways-to-run-jest-test-cases-silently-67d2fead8c11

global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
};

jest.spyOn(global.console, "log").mockImplementation(jest.fn());
jest.spyOn(global.console, "warn").mockImplementation(jest.fn());
jest.spyOn(global.console, "error").mockImplementation(jest.fn());
