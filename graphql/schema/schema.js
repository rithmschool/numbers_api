const graphql = require("graphql");
const { getAllFacts } = require("../../models/fact.js");
const _ = require("underscore");

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
} = graphql;

// let numberFacts = getAllFacts(24);

let dummyData = [
  {
    number: 24,
    math: ["24math1", "24marth1"],
    trivia: ["24trv"],
    date: ["24date1", "24date2"],
    year: ["24year"],
  },
  {
    number: 25,
    math: ["25math1", "25math2"],
    trivia: ["25trv"],
    date: ["25date1", "25date2"],
    year: ["24year"],
  },
];

const NumberType = new GraphQLObjectType({
  name: "Number",
  fields: () => ({
    number: { type: GraphQLInt },
    math: {
      type: new GraphQLList(GraphQLString),
    },
    trivia: {
      type: new GraphQLList(GraphQLString),
    },
    date: {
      type: new GraphQLList(GraphQLString),
    },
    year: {
      type: new GraphQLList(GraphQLString),
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    number: {
      type: NumberType,
      args: { number: { type: GraphQLInt } },
      resolve(parent, args) {
        // code to get data from db / other source
        let num = args.number;
        return getAllFacts(num);
        // return _.find(dummyData, { number: args.number });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
