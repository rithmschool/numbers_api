const { defaults } = require("jest-config");
// https://jestjs.io/docs/en/configuration
module.exports = {
  setupFilesAfterEnv: [`${__dirname}/__tests__/setup.js`],
  testPathIgnorePatterns: [`${__dirname}/__tests__/setup.js`],
};
