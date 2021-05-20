const app = require("../../app");
const request = require("supertest");
const fact = require("../../models/fact");

describe("Integration/unit testing app.js", function () {
  describe("GET /", function () {
    test("GET request responds with a 200 status code and returns HTML", async () => {
      const response = await request(app).get("/");
      const { statusCode, text } = response;
      expect(statusCode).toBe(200);
    });
  });

  describe("POST => /submit", function () {
    test("POST /submit request should return data to user", async () => {
      let data = {
        trivia: true,
        number: 5,
        fact: "5 is an odd number",
      };
      const response = await request(app).post("/submit").send(data);
      const { body } = response;
      expect(body).toEqual(data);
    });
  });
});
