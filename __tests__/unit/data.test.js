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
    "/path/to/manual/file2.txt":
      "500 t the number of detectable earthquakes in the world each year",
  };

  /**
   * Setting in-memory data for dummy data in our mocks directory
   */
  beforeEach(function () {
    let stringify = JSON.stringify(MOCK_INFO);
    require("fs").__setMockFiles(MOCK_INFO);
    require("fs").__setMockFileContent(stringify);
    consoleSpy = jest.spyOn(console, "warn");
  });

  // Clearing our mocks
  afterEach(function () {
    jest.clearAllMocks();
  });

  describe("reader_norm function", function () {
    test("Logs error message to the console", function () {
      let data = {};
      let badPath = "/path/to/norm/bad/";
      let callback = jest.fn((el) => el);
      reader_norm(data, badPath, callback);
      expect(consoleSpy).toHaveBeenCalled();
    });

    test("Given a bad pathname, no data is added to our input object", function () {
      let data = {};
      let badPath = "/path/to/norm/bad/";
      let callback = jest.fn((el) => el);
      reader_norm(data, badPath, callback);
      let keys = Object.keys(data);
      expect(keys.length).toEqual(0);
    });

    test("Correctly adds data to our input object given a correct pathname", function () {
      let data = {};
      let pathname = "/path/to/norm/good/";
      let cb = jest.fn((el) => el);
      reader_norm(data, pathname, cb);
      let keys = Object.keys(data);
      expect(keys.length).toBeGreaterThan(0);
    });
  });

  describe("reader_manual function", function () {
    test("Adds data to the correct category in our input object", function () {
      let data = { t: {}, y: {}, m: {}, d: {} };
      let path = "/path/to/manual/";
      let cb = jest.fn((el) => el);
      reader_manual(data, path, cb);
      let triviaKeys = Object.keys(data["t"]);
      expect(triviaKeys.length).toBeGreaterThan(0);
    });

    test("Logs error message to the console", function () {
      let data = { t: {}, y: {}, m: {}, d: {} };
      let path = "/path/to/norm/bad/";
      let cb = jest.fn((el) => el);
      reader_manual(data, path, cb);
      expect(consoleSpy).toHaveBeenCalled();
    });

    test("no data is added if given a bad pathname", function () {
      let data = { t: {}, y: {}, m: {}, d: {} };
      let path = "/path/to/norm/bad/";
      let cb = jest.fn((el) => el);
      reader_manual(data, path, cb);
      for (let key in data) {
        const keys = Object.keys(data[key]);
        expect(keys.length).toEqual(0);
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

    test("returns undefined if self key is set to true", function () {
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

    test("Doesn't modify input text value if NP tag is passed in", function () {
      let element = {
        date: "Augst 4",
        text:
          "118 t the number of decibels of the loudest burp, held by record-holder Paul Hunn, which is as loud as a chainsaw",
        self: false,
        pos: "NP",
      };
      let newElement = normalize_common(element);
      for (let key in newElement) {
        const currElement = newElement[key];
        expect(currElement).toEqual(element[key]);
      }
    });
  });
});
