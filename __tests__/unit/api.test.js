const { appendToFile, route } = require("../../routes/api");
const fs = require("fs");

describe("appendToFile()", () => {
  test("adds to a file", function () {
    let testFile = fs.writeFile("./facts-dump/test.txt", "", (err) => {
      if (err) throw err;
    });
    let writeToTestFile = appendToFile("./facts-dump/test.txt", "hello world");
    fs.readFile("./facts-dump/test.txt", "utf8", (err, data) => {
      if (err) throw err;

      expect(data).toEqual("hello world");
    });
  });
});

describe("routes", () => {
  test("", function () {});
});
