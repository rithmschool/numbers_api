const app = require("../../app");
const request = require("supertest");
const fact = require("../../models/fact");
const api = require("../../routes/api");

describe("Integration/unit testing app.js", function () {
  describe("GET /", function () {
    test("GET request responds with a 200 status code and returns HTML", async () => {
      const response = await request(app).get("/");
      const { statusCode, text } = response;
      expect(statusCode).toBe(200);
      const titleDescription = `An API for interesting facts about numbers`;
      expect(text).toContain(titleDescription);
    });

    test("GET request should call fact.getFact()", async () => {
      const getFact = jest.spyOn(fact, "getFact");
      const response = await request(app).get("/");
      expect(getFact).toHaveBeenCalled();
    });
  });

  describe("POST => /submit", function () {
    test("POST request should respond with a 200 status code", async () => {
      const response = await request(app).post("/submit");
      const { statusCode } = response;
      expect(statusCode).toBe(200);
    });

    test("POST /submit request should not return data to user if no headers are set", async () => {
      let data = {
        trivia: true,
        number: 5,
        fact: "5 is an odd number",
      };
      const response = await request(app).post("/submit").send(data);
      const { body } = response;
      expect(body).toEqual(data);
    });

    test("POST /submit request should call appendToFile method in our router", async () => {
      const appendToFile = jest.spyOn(api, "appendToFile");
      let data = {
        trivia: true,
        number: 5,
        fact: "5 is an odd number",
      };

      const response = await request(app).post("/submit").send(data);
      expect(appendToFile).toHaveBeenCalled();
    });
  });
});
