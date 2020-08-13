const app = require("../../app");
const request = require("supertest");
/**
 * 
* FIRST ROUTE:
- Test that the template gets rendered (?)
- Test that given different inputs into fact.getFact() method, we correctly add data to the template
- Test cases for error-handling when bad info is passed into fact methods()

 app.get("/", function (req, res) {
  var currDate = new Date();
  res.render("index.html", {
    docs: apiDocsHtml,
    sharesFact: fact.getFact(numShares, "trivia", {
      notfound: "floor",
      fragment: true,
    }),
    numShares: numShares,
    dateFact: {
      day: currDate.getDate(),
      month: currDate.getMonth() + 1,
      data: fact.getFact(utils.dateToDayOfYear(currDate), "date", {}),
    },
  });
});

 *
 * SECOND ROUTE:
 * 

app.post("/submit", function (req, res) {
  router.appendToFile("./suggestions.json", JSON.stringify(req.body) + "\n");
  res.send(req.body);
});
 * 
 * 
 
 * 
 * 
 */

describe("app.js", function () {
  beforeAll((done) => {
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
  });

  afterAll((done) => {
    app.close();
    done();
  });
});
