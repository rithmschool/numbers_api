const { appendToFile } = require("../../routes/numbers");
const fs = require("fs");
const app = require("../../app");
const request = require("supertest");
const utils = require("../../public/js/shared_utils.js");

describe("appendToFile()", () => {
  test("adds to a file", function () {
    let testFile = fs.writeFile("./facts-dump/test.txt", "", (err) => {
      if (err) throw err;
    });

    appendToFile("./facts-dump/test.txt", "hello world");
    fs.readFile("./facts-dump/test.txt", "utf8", (err, data) => {
      if (err) throw err;

      expect(data).toEqual("hello world");
    });
  });
});

describe("non random routes", () => {
  // test for route "/:num(-?[0-9]+)"

  test("return data for one specific number", async function () {
    const res = await request(app).get("/1");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("1");
  });

  // tests for route "/:num([-0-9.,]+)"

  test("batch request with only range", async function () {
    const res = await request(app).get("/1..3");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("1", "2", "3");
  });

  test("batch request with range and specific number", async function () {
    const res = await request(app).get("/1..3,10");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("1", "2", "3", "10");
  });

  test("invalid url for batch request", async function () {
    const res = await request(app).get("/1...3");
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual("Invalid url");
  });

  test("batch request with type 'date'", async function () {
    const res = await request(app).get("/3..5/date");
    expect(res.statusCode).toBe(200);
    expect(res.body[3]).toContain("January 3rd");
  });

  test("batch request with type 'math'", async function () {
    const res = await request(app).get("/3..5/math");
    let resWords = res.body[3].split(" ");
    expect(res.statusCode).toBe(200);
    expect(+resWords[0]).toEqual(3);
  });

  test("batch request with type 'trivia'", async function () {
    const res = await request(app).get("/3..5/trivia");
    let resWords = res.body[3].split(" ");
    expect(res.statusCode).toBe(200);
    expect(+resWords[0]).toEqual(3);
  });

  test("batch request with type 'year'", async function () {
    const res = await request(app).get("/3..5/year");
    expect(res.statusCode).toBe(200);
    expect(res.body[3]).toContain("is the year");
  });

  // tests for route "/:month(-?[0-9]+)/:day(-?[0-9]+)/:type(date)?"

  test("month/day form with type 'date'", async function () {
    const res = await request(app).get("/2/3/date");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("February 3rd");
  });

  test("month/day form without type defined", async function () {
    const res = await request(app).get("/2/3");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("February 3rd");
  });

  test("month/day form with month above 12", async function () {
    const res = await request(app).get("/13/8/date");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("January 8th");
  });

  test("invalid month/day form", async function () {
    const res = await request(app).get("/2/3/math");
    expect(res.statusCode).toBe(404);
  });

  // tests for route "/:date([-0-9/.,]+)/:type(date)?"

  test("batch request for a range of dates", async function () {
    const res = await request(app).get("/10/15..10/31,12/31/date");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("289");
  });
});

describe("random routes", () => {
  beforeEach(() => {
    utils.randomIndex = jest.fn(() => 1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // tests for route "/random/:type?"
/**
 * [
      '0',        'is',
      'the',      'coldest',
      'possible', 'temperature',
      'old',      'the',
      'Kelvin',   'scale.'
    ]

 */
  test("random with without type defined", async function () {
    const res = await request(app).get("/random");
    let resWords = res.text.split(" ");
    console.log('res', res, 'res Words here', resWords);
    expect(resWords[0]).toEqual("0");
  });

  test("random with type 'date'", async function () {
    const res = await request(app).get("/random/date");
    let resWords = res.text.split(" ");
    expect(res.statusCode).toBe(200);
    expect(resWords[0] + " " + resWords[1]).toEqual("January 1st");
  });

  test("random with type 'math'", async function () {
    const res = await request(app).get("/random/math");
    let resWords = res.text.split(" ");
    expect(res.statusCode).toBe(200);
    expect(resWords[0]).toEqual("0");
  });

  test("random with type 'trivia'", async function () {
    const res = await request(app).get("/random/trivia");
    let resWords = res.text.split(" ");
    expect(res.statusCode).toBe(200);
    expect(resWords[0]).toEqual("0");
  });

  test("random with type 'year'", async function () {
    const res = await request(app).get("/random/year");
    let resWords = res.text.split(" ");
    expect(res.statusCode).toBe(200);
    expect(resWords[0] + " " + resWords[1]).toContain("1225 BC");
  });
});
