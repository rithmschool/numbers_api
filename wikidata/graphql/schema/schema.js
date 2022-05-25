const { resolvers } = require("./resolvers");
const { typeDefs } = require("./typeDefs");
const { makeExecutableSchema } = require("graphql-tools");

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = {
  schema,
};
