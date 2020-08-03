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
      let badPath = "/path/to/norm/bad/";
      let callback = jest.fn((el) => el);
      reader_norm(data, badPath, callback);
      expect(consoleSpy).toHaveLastReturnedWith("Skipping invaid number_key");
    });

    test("doesnt add data to our input object if given bad path", function () {
      let data = {};
      let badPath = "/path/to/norm/bad/";
      let callback = jest.fn((el) => el);
      reader_norm(data, badPath, callback);
      expect(Object.keys(data).length).toEqual(0);
    });

    test("adds data to our empty object after passing into reader_norm if given good path", function () {
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
    });

    test("console.logs a message if a bad path is passed in", function () {
      let data = { t: {}, y: {}, m: {}, d: {} };
      let path = "/path/to/norm/bad/";
      let cb = jest.fn((el) => el);
      reader_manual(data, path, cb);
      expect(consoleSpy).toHaveBeenCalled();
    });

    test("no data is added if a bad path is passed", function () {
      let data = { t: {}, y: {}, m: {}, d: {} };
      let path = "/path/to/norm/bad/";
      let cb = jest.fn((el) => el);
      reader_manual(data, path, cb);
      for (let key in data) {
        expect(Object.keys(data[key]).length).toEqual(0);
      }
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
      element = normalize_common(element);
      expect(element.text[0]).not.toEqual(element.text[0].toUpperCase());
    });

    test("returns undefined if self tag is set to true", function () {
      let element = {
        date: "August 4",
        text: "This is some text",
        self: true,
        pos: "DET",
      };
      expect(normalize_common(element)).toBeUndefined();
    });

    test("returns undefined if invalid character is passed in", function () {
      let element = {
        date: "Augst 4",
        text: "invalid!!!@#)((*!@)$",
        self: false,
        pos: "NP",
      };

      expect(normalize_common(element)).toBeUndefined();
    });

    test("text remains the same if NP tag is passed in", function () {
      let element = {
        date: "Augst 4",
        text: "Gurl same....",
        self: false,
        pos: "NP",
      };
      let newElement = normalize_common(element);
      for (let key in newElement) {
        expect(newElement[key]).toEqual(element[key]);
      }
    });
  });

  afterAll(function () {
    jest.clearAllMocks();
  });
});
