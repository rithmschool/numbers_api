const graphql = require("graphql");
const { getAllFacts } = require("../../models/fact.js");

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
} = graphql;

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
        let num = args.number;
        return getAllFacts(num);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
