const {
  readerNorm,
  readerManual,
  normalizeCommon,
} = require("../../models/data");

describe("data.js functions", function () {
  let errorSpy;
  let consoleSpy;

  beforeEach(function () {
    errorSpy = jest.spyOn(console, "error");
    errorSpy.mockImplementation((err) => err.message || err);
    consoleSpy = jest.spyOn(console, "log");
    consoleSpy.mockImplementation((err) => err.message || err);
  });

  describe("reader_norm function", function () {
    test("it should log bad path error message", function () {
      let out = {};
      let pathname = "does/not/exist/";
      let callback = jest.fn((el) => el);
      readerNorm(out, pathname, callback);
      expect(errorSpy).toHaveReturnedWith(
        `Error reading directory ${pathname}: `
      );
    });
  });
});
