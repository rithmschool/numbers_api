const app = require("../../app");
const request = require("supertest");
const fact = require("../../models/fact");

describe("app.js", function () {
  beforeEach((done) => {
    done();
  });

  describe("GET /", function () {
    test("it should respond with a 200 status code", async function (done) {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200);
      done();
    });

    test("response should return html", async function (done) {
      const response = await request(app).get("/");
      expect(response.text).toContain("<!DOCTYPE html>");
      done();
    });

    test("it should call fact.getFact()", async function (done) {
      let getFact = jest.spyOn(fact, "getFact");
      const response = await request(app).get("/");
      expect(getFact).toHaveBeenCalled();
      done();
    });
  });

  describe("POST /submit", function () {
    test("it should respond with a 200 status code", async function (done) {
      const response = await request(app).post("/submit");
      expect(response.statusCode).toBe(200);
      done();
    });

    test("it should return request body to user", async function (done) {
      let data = {
        trivia: true,
        number: 5,
        fact: "5 is an odd number",
      };

      const response = await request(app)
        .post("/submit")
        .send(data)
        .set("Content-Type", "application/json");

      expect(response.body).toEqual(data);
      done();
    });

    test("it should not return data to user if no headers are set", async function (done) {
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

  afterEach((done) => {
    done();
  });
});
