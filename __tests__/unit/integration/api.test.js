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

  // test for route "/:num(-?[0-9]+)"

  test("1st route", async function () {
    const res = await request(app).get("/1");
    expect(res.text).toContain("1");
  });

  // tests for route "/:num([-0-9.,]+)"

  test("batch request with only range", async function () {
    const res = await request(app).get("/1..3");
    expect(res.body).toHaveProperty("1", "2", "3");
  });

  test("batch request with range and specific number", async function () {
    const res = await request(app).get("/1..3,10");
    expect(res.body).toHaveProperty("1", "2", "3", "10");
  });

  test("invalid url for batch request", async function () {
    const res = await request(app).get("/1...3");
    expect(res.text).toEqual("Invalid url");
  });

  test("batch request with type 'date'", async function () {
    const res = await request(app).get("/3..5/date");
    expect(res.body[3]).toContain("January 3rd");
  });

  test("batch request with type 'math'", async function () {
    const res = await request(app).get("/3..5/math");
    let resWords = res.body[3].split(" ");
    expect(Number(resWords[0])).toEqual(3);
  });

  test("batch request with type 'trivia'", async function () {
    const res = await request(app).get("/3..5/trivia");
    let resWords = res.body[3].split(" ");
    expect(Number(resWords[0])).toEqual(3);
  });

  test("batch request with type 'year'", async function () {
    const res = await request(app).get("/3..5/year");
    // has "is the year"
    expect(res.body[3]).toContain("is the year");
  });

  // tests for route "/:month(-?[0-9]+)/:day(-?[0-9]+)/:type(date)?"

  test("month/day form with type 'date'", async function () {
    const res = await request(app).get("/2/3/date");
    expect(res.text).toContain("February 3rd");
  });

  test("month/day form without type defined", async function () {
    const res = await request(app).get("/2/3");
    expect(res.text).toContain("February 3rd");
  });

  test("month/day form with month above 12", async function () {
    const res = await request(app).get("/13/8/date");
    expect(res.text).toContain("January 8th");
  });

  test("invalid month/day form", async function () {
    const res = await request(app).get("/2/3/math");
    expect(res.statusCode).toBe(404);
  });

  // tests for route "/:date([-0-9/.,]+)/:type(date)?"

  // tests for route "/random/:type?"

  test("random with without type defined", async function () {
    const res = await request(app).get("/random");
    let resWords = res.text.split(" ");
    expect(typeof Number(resWords[0])).toEqual("number");
  });

  test("random with type 'date'", async function () {
    const res = await request(app).get("/random/date");
    let resWords = res.text.split(" ");
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    expect(months).toContain(resWords[0]);
  });

  test("random with type 'math'", async function () {
    const res = await request(app).get("/random/math");
    let resWords = res.text.split(" ");
    expect(typeof Number(resWords[0])).toEqual("number");
  });

  test("random with type 'trivia'", async function () {
    const res = await request(app).get("/random/trivia");
    let resWords = res.text.split(" ");
    expect(typeof Number(resWords[0])).toEqual("number");
  });

  test("random with type 'year'", async function () {
    // can't test for year itself
    // data contains years after the current year, eg
    // 2058 is the year that the Beatles catalogue will enter
    // the public domain, assuming that copyright is not extended again.
    const res = await request(app).get("/random/year");
    expect(res.text).toContain("is the year");
  });

  test("batch request for a range of dates", async function () {
    const res = await request(app).get("/10/15..10/31,12/31/date");
    expect(res.text).toContain("289");
  });
});
