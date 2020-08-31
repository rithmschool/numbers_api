const app = require("../../app");
const request = require("supertest");
const fact = require("../../models/fact");
const { createWriteStream } = require("../../__mocks__/fs");

describe("app.js", function () {
  beforeEach(() => {
    jest.mock("fs", () => {
      createWriteStream: (filepath, ...args) => {
        return {
          write: (dataStream) => console.log("Writing..."),
          destroySoon: () => console.log("Destroying stream..."),
        };
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /", function () {
    test("GET request responds with a 200 status code", async function (done) {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200);
      done();
    });

    test("GET request responds with html", async function (done) {
      const response = await request(app).get("/");
      expect(response.text).toContain("<!DOCTYPE html>");
      done();
    });

    test("GET request should call fact.getFact()", async function (done) {
      let getFact = jest.spyOn(fact, "getFact");
      const response = await request(app).get("/");
      expect(getFact).toHaveBeenCalled();
      done();
    });
  });

  describe("POST /submit", function () {
    test("POST request should respond with a 200 status code", async function (done) {
      const response = await request(app).post("/submit");
      expect(response.statusCode).toBe(200);
      done();
    });

    test("POST request should not return data to user if no headers are set", async function (done) {
      let data = {
        trivia: true,
        number: 5,
        fact: "5 is an odd number",
      };
      const response = await request(app).post("/submit");
      expect(Object.keys(response.body).length).toEqual(0);
      done();
    });
  });
});
