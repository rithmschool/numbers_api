const {
  readerNorm,
  readerManual,
  normalizeCommon,
} = require("../../models/data");

jest.mock("fs");

describe("data.js functions", function () {
  let errorSpy;
  let consoleSpy;

  const MOCK_INFO = {
    "/path/to/norm/good/file1.txt": {
      "213": [
        {
          text:
            "Marcus Aurelius Antoninus Augustus (Caracalla) and Decimus Caelius Calvinus Balbinus become Roman Consuls.",
          self: false,
          pos: "NP",
        },
        {
          text:
            "Emperor Caracalla leaves Rome and expels some German marauders from Gaul.",
          self: false,
          pos: "NP",
        },
      ],
    },
    "/path/to/norm/bad/file2.txt": { "": [] },
    "/path/to/manual/file2.txt": "stuffff",
  };

  beforeEach(function () {
    errorSpy = jest.spyOn(console, "error");
    errorSpy.mockImplementation((err) => err.message || err);

    consoleSpy = jest.spyOn(console, "log");
    consoleSpy.mockImplementation((err) => err.message || err);

    require("fs").__setMockFiles(MOCK_INFO);
    require("fs").__setMockFileContent(MOCK_INFO);
  });

  describe("reader_norm function", function () {
    test("logs invalid key to the console", function () {
      let data = {};
      let pathname = "/path/to/norm/bad/";
      let callback = jest.fn((el) => el);
      readerNorm(data, pathname, callback);
      expect(consoleSpy).toHaveLastReturnedWith("Skipping invaid number_key");
    });
  });

  test("input object is not the same after calling readerNorm", async function () {
    let data = {};
    let pathname = "/path/to/norm/good/";
    let cb = jest.fn((el) => el);
    readerNorm(data, pathname, cb);
    expect(Object.keys(data).length).toBeGreaterThan(0);
  });
});
