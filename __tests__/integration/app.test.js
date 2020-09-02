const app = require("../../app");
const request = require("supertest");
const fact = require("../../models/fact");
const api = require("../../routes/api");

describe("app.js", function () {
  describe("GET /", function () {
    test("GET request responds with a 200 status code and returns HTML", async function (done) {
      const response = await request(app).get("/");
      const { statusCode, text } = response;
      expect(statusCode).toBe(200);
      expect(text).toContain("<!DOCTYPE html>");
      done();
    });

    test("GET request should call fact.getFact()", async function (done) {
      const getFact = jest.spyOn(fact, "getFact");
      const response = await request(app).get("/");
      expect(getFact).toHaveBeenCalled();
      done();
    });
  });

  describe("POST => /submit", function () {
    test("POST request should respond with a 200 status code", async function (done) {
      const response = await request(app).post("/submit");
      const { statusCode } = response;
      expect(statusCode).toBe(200);
      done();
    });

    test("POST /submit request should not return data to user if no headers are set", async function (done) {
      let data = {
        trivia: true,
        number: 5,
        fact: "5 is an odd number",
      };
      const response = await request(app).post("/submit").send(data);
      expect(Object.keys(response.body).length).toEqual(0);
      done();
    });

    test("POST /submit request should call appendToFile method in our router", async function (done) {
      const appendToFile = jest.spyOn(api, "appendToFile");
      let data = {
        trivia: true,
        number: 5,
        fact: "5 is an odd number",
      };

      const response = await request(app).post("/submit").send(data);
      expect(appendToFile).toHaveBeenCalled();
      done();
    });
  });
});
