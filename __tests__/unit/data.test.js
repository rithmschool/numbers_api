const {
  reader_norm,
  reader_manual,
  normalize_common,
} = require("../../models/data");

jest.mock("fs");

describe("data.js functions", function () {
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
    "/path/to/norm/bad/file2.txt": { invalid: [] },
    "/path/to/manual/file2.txt": [
      "100 t the approximate number of eyes a scallop has around the edge of its shell",
    ],
  };

  beforeEach(function () {
    let stringify = JSON.stringify(MOCK_INFO);
    require("fs").__setMockFiles(MOCK_INFO);
    require("fs").__setMockFileContent(stringify);
  });

  describe("reader_norm function", function () {
    beforeEach(function () {
      consoleSpy = jest.spyOn(console, "log");
      consoleSpy.mockImplementationOnce((err) => err.message || err);
    });

    test("handles invalid key in the console", function () {
      let data = {};
      let pathname = "/path/to/norm/bad/";
      let callback = jest.fn((el) => el);
      reader_norm(data, pathname, callback);
      expect(consoleSpy).toHaveLastReturnedWith("Skipping invaid number_key");
    });

    test("adds data to our empty object after passing into reader_norm", function () {
      let data = {};
      let pathname = "/path/to/norm/good/";
      let cb = jest.fn((el) => el);
      reader_norm(data, pathname, cb);
      expect(Object.keys(data).length).toBeGreaterThan(0);
    });
  });

  describe("reader_manual function", function () {
    test("adds data to the correct category in our input object", function () {
      let data = { t: {}, y: {}, m: {}, d: {} };
      let path = "/path/to/manual/";
      let cb = jest.fn((el) => el);
      reader_manual(data, path, cb);
      expect(Object.keys(data["t"]).length).toBeGreaterThan(0);
      expect(Object.keys(data["y"]).length).toEqual(0);
      expect(Object.keys(data["m"]).length).toEqual(0);
      expect(Object.keys(data["d"]).length).toEqual(0);
    });

    test("console.logs a message if a bad path is passed in", function () {
      let data = { t: {}, y: {}, m: {}, d: {} };
      let path = "/path/to/norm/bad/";
      let cb = jest.fn((el) => el);
      reader_manual(data, path, cb);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe("normalize_common function", function () {
    test("removes capitalization when 'NP' tag is not passed in", function () {
      let element = {
        date: "August 4",
        text:
          "A newly passed U.S. tariff act creates the system of cutters for revenue enforcement (later named the United States Revenue Cutter Service), the forerunner of the Coast Guard.",
        self: false,
        pos: "DET",
      };
      let elementCopy = { ...element };
      element = normalize_common(element);
      expect(elementCopy.text).not.toEqual(element.text);
    });
  });
});
