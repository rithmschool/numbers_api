const {
  reader_norm,
  reader_manual,
  normalizeElement,
} = require("../../models/data");

jest.mock("fs");

describe("Unit testing functions in `models/data.js`", function () {
  let consoleSpy;
  let data;
  let callback;

  // Mock data to replace having to read from the disc
  const MOCKINFO = {
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
    let mockInfoStringify = JSON.stringify(MOCKINFO);
    require("fs").__setMockFiles(MOCKINFO);
    require("fs").__setMockFileContent(mockInfoStringify);
    consoleSpy = jest.spyOn(console, "warn");
  });

  // Clearing our mocks
  afterEach(function () {
    jest.clearAllMocks();
  });

  describe("Testing reader_norm function", function () {
    beforeEach(function () {
      data = {};
      callback = jest.fn((el) => el);
    });

    test("Logs error message to the console", function () {
      let badPath = "/path/to/norm/bad/";
      reader_norm(data, badPath, callback);
      expect(consoleSpy).toHaveBeenCalled();
    });

    test("No data is added to our input object when given a bad pathname", function () {
      let badPath = "/path/to/norm/bad/";
      reader_norm(data, badPath, callback);
      let keys = Object.keys(data);
      expect(keys.length).toEqual(0);
    });

    test("Correctly adds data to our input object given a correct pathname", function () {
      let pathname = "/path/to/norm/good/";
      reader_norm(data, pathname, callback);
      let keys = Object.keys(data);
      expect(keys.length).toBeGreaterThan(0);
    });
  });

  describe("Testing reader_manual function", function () {
    beforeEach(function () {
      data = { t: {}, y: {}, m: {}, d: {} };
      callback = jest.fn((el) => el);
    });

    // This test checks that we've added data to the appropriate key value input
    test("checks that we've added data to the appropriate key value store in our input object", function () {
      let path = "/path/to/manual/";
      reader_manual(data, path, callback);
      let triviaKeys = Object.keys(data["t"]);
      expect(triviaKeys.length).toBeGreaterThan(0);
    });

    test("Logs error message to the console when given a bad pathname", function () {
      let path = "/path/to/norm/bad/";
      reader_manual(data, path, callback);
      expect(consoleSpy).toHaveBeenCalled();
    });

    test("No data is added to our input object when given a bad pathname", function () {
      let path = "/path/to/norm/bad/";
      reader_manual(data, path, callback);
      for (let key in data) {
        const keys = Object.keys(data[key]);
        expect(keys.length).toEqual(0);
      }
    });
  });

  describe("Testing normalizeElement function", function () {
    test("function sets first letter in text to lowercase character when 'DET' tag is passed in", function () {
      let element = {
        date: "August 4",
        text:
          "In response to the German invasion of Belgium, Great Britain entered World War I, declaring war on Germany.",
        self: false,
        pos: "DET",
      };
      element = normalizeElement(element);
      console.log("ELEMENT!", element);
      expect(element.text[0]).toEqual(element.text[0].toLowerCase());
    });

    test("function returns undefined if `self` key is set to true", function () {
      let element = {
        date: "August 4",
        text: "This is some text",
        self: true,
        pos: "DET",
      };
      expect(normalizeElement(element)).toBeUndefined();
    });

    test("function returns undefined if invalid character is passed in", function () {
      let element = {
        date: "August 4",
        text: "invalid!!!@#)((*!@)$",
        self: false,
        pos: "NP",
      };

      expect(normalizeElement(element)).toBeUndefined();
    });
  });
});
