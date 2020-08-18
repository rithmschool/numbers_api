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

  afterEach((done) => {
    done();
  });
});
