const { resolvers } = require("../../graphql/schema/Resolvers");
const EasyGraphQLTester = require("easygraphql-tester");
const { typeDefs } = require("../../graphql/schema/TypeDefs");
const { schema } = require("../../graphql/schema/Schema");


describe("Test getNumberFacts queries", () => {
  let tester;

  beforeEach(() => {

    tester = new EasyGraphQLTester(schema);
  });

  it("Should return the correct query result", async () => {
    const query = `
            {
                getNumberFacts(number: 100) {
                    trivia
                    math
                    year
                }
            }
        `;

    let result = await tester.graphql(query);
    result = result.data.getNumberFacts;

    expect(Object.keys(result).length).toEqual(3);
    expect(result.trivia.length).toEqual(9);
    expect(result.math.length).toEqual(5);
    expect(result.year.length).toEqual(15);
  });

  it("If number does not have fact, response includes default message ", async () => {
    const query = `
            {
                getNumberFacts(number: 299) {
                    trivia
                }
            }
        `;
    let result = await tester.graphql(query);
    result = result.data.getNumberFacts;

    expect(Object.keys(result).length).toEqual(1);
    expect(result.trivia[0]).toEqual(
      expect.stringContaining(
        "Submit one at github.com/rithmschool/numbers_api"
      )
    );
  });

  it("Result includes specific entry", async () => {
    const query = `
            {
                getNumberFacts(number: 6) {
                    math
                }
            }
        `;
    let result = await tester.graphql(query);
    result = result.data.getNumberFacts;

    expect(Object.keys(result).length).toEqual(1);
    expect(result.math[0]).toEqual("the smallest perfect number");
  });

  it("Should return the correct date for first leap year", async () => {
    const query = `
    {
        getNumberFacts(number: 60) {
            date
        }
    }
    `;

    let result = await tester.graphql(query);
    result = result.data.getNumberFacts.date;

    expect(result[0]).toEqual(expect.stringContaining("February 29th"));
    expect(result[0]).toEqual(
        expect.not.stringContaining("Submit one at github.com/rithmschool/numbers_api")
    );
    expect(result.length).toBeGreaterThan(1);
  })

  it("Should return the correct date for negative numbers", async () => {
    const query = `
    {
        getNumberFacts(number: -2) {
            date
        }
    }
    `;

    let result = await tester.graphql(query);
    result = result.data.getNumberFacts.date;

    expect(result[0]).toEqual(expect.stringContaining("December 29th"));
    expect(result[0]).toEqual(
        expect.not.stringContaining("Submit one at github.com/rithmschool/numbers_api")
    );
    expect(result.length).toBeGreaterThan(1);
  })

  it("Should return the correct date for first leap year", async () => {
    const query = `
    {
        getNumberFacts(number: 4000) {
            date
        }
    }
    `;

    let result = await tester.graphql(query);
    result = result.data.getNumberFacts.date;

    expect(result[0]).toEqual(expect.stringContaining("December 13th"));
    expect(result[0]).toEqual(
        expect.not.stringContaining("Submit one at github.com/rithmschool/numbers_api")
    );
    expect(result.length).toBeGreaterThan(1);
  })
});
