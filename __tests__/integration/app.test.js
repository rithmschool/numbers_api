const app = require("../../app");
const request = require("supertest");
const fact = require("../../models/fact");
const numbers = require("../../routes/numbers");
const { appendToFile } = require("../../routes/numbers");

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

    // test("POST /submit request should call appendToFile method in our router", async () => {
    //   const appendedToFile = jest.spyOn(numbers, "appendToFile");
    //   let data = {
    //     trivia: true,
    //     number: 5,
    //     fact: "5 is an odd number",
    //   };

    //   numbers.appendToFile("./facts-dump/test.txt", "hello world");
    //   // console.log('APPENDED TO FILE, LINE 47', appendedToFile);

    //   const response = await request(app).post("/submit").send(data);
    //   console.log("RESPONSE", response)
    //   expect(appendedToFile).toHaveBeenCalled();
    // });
  });
});
