const { resolvers } = require("../graphql/schema/resolvers");
const EasyGraphQLTester = require("easygraphql-tester");
const { typeDefs } = require("../graphql/schema/typeDefs");
const { schema } = require("../graphql/schema/schema");

describe("Test attractions/museums queries", () => {
  let tester;

  beforeEach(() => {
    tester = new EasyGraphQLTester(schema);
  });

  it("Should return all attractions", async () => {
    const query = `
            {
                getAttractions(keyword: "attraction") {
                    name
                    visitors
                    coordinates
                }
            }
        `;

    let result = await tester.graphql(query);
    result = result.data.getAttractions;

    expect(result).toEqual([
      {
        name: "Attraction 1",
        visitors: 0,
        coordinates: "Point(60.572472222 56.893194444)",
      },
      {
        name: "Attraction 2",
        visitors: 2,
        coordinates: "Point(-77.03655 38.897669444)",
      },
      {
        name: "Attraction 3",
        visitors: 19,
        coordinates: "Point(60.72222 56.893194)",
      },
    ]);
  });

  it("Filters correctly by keyword", async () => {
    const query = `
            {
                getAttractions(keyword: "2") {
                    name
                }
            }
        `;
    let result = await tester.graphql(query);
    result = result.data.getAttractions;

    expect(result).toEqual([
      {
        name: "Attraction 2",
      },
    ]);
  });

  it("Shows no results if keyword does not mach", async () => {
    const query = `
            {
                getAttractions(keyword: "donkeydoodle") {
                    name
                }
            }
        `;
    let result = await tester.graphql(query);
    result = result.data.getAttractions;

    expect(result).toEqual([]);
  });
});
