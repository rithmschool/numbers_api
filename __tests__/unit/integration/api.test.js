const { appendToFile } = require("../../../routes/api");
const fs = require("fs");
const app = require("../../../app");
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
  // done() pattern needed for all tests
  // without done() we get a jest TCPSERVERWRAP error

  // am not sure what to call the tests
  // plugging in which route for now

  test("1st route", async function (done) {
    const res = await request(app).get("/1");
    expect(res.text).toContain("1");
    done();
  });

  test("2nd route and implicitly testing getBatchNums()", async function (done) {
    const res = await request(app).get("/1..3");
    expect(res.body).toHaveProperty("1", "2", "3");
    done();
  });

  test("invalid url in 2nd route", async function (done) {
    const res = await request(app).get("/1...3");
    expect(res.text).toEqual("Invalid url");
    done();
  });

  test("3rd route", async function (done) {
    // idk what to call 2nd route

    const res = await request(app).get("/2/3/date");
    expect(res.text).toContain("February 3rd");
    done();
  });
});
