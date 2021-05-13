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
});
