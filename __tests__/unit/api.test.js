const { appendToFile } = require("../../routes/api");
const fs = require("fs");
const app = require("../../app");
const request = require("supertest");

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
  test("implicitly testing getBatchNums() and 2nd route", async function () {
    // idk what to call 2nd route
    // this test isnt completed,
    // jest doesnt exit after this test runs
    // investigate further, probably has to do with the async code
    const res = await request(app).get("/1..3");
    expect(res.body).toHaveProperty("1", "2", "3");
  });
});
