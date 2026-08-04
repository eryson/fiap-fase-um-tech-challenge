require('reflect-metadata');

global.console = {
  ...console,
  error: jest.fn(),
};
