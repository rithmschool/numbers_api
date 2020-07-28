const {
  readerNorm,
  readerManual,
  normalizeCommon,
} = require("../../models/data");

const { summarizeFiles, readFiles } = require("./summarizeFiles");
jest.mock("fs");

describe("data.js functions", function () {
  let errorSpy;

  const MOCK_INFO = {
    "/path/to/norm/file1.txt": {
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
    "/path/to/norm/file2.txt": { "": [] },
    "/path/to/manual/file2.txt": "stuffff",
  };

  beforeEach(async function () {
    errorSpy = await jest.spyOn(console, "error");
    await errorSpy.mockImplementation((err) => err.message || err);
    require("fs").__setMockFiles(MOCK_INFO);
    require("fs").__setMockFileContent(MOCK_INFO);
  });

  describe("reader_norm function", function () {
    test("it reads an existing text file correctly", async function () {
      let data = {};
      let pathname = "/path/to/norm/";
      let callback = jest.fn((el) => el);
      readerNorm(data, pathname, callback);
      // console.log(mockFileContent);
      // summarizeFiles(pathname);
      // readFiles(pathname, "file1.txt");
    });
  });
});
