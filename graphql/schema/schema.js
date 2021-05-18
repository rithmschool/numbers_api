const { resolvers } = require('./Resolvers');
const { typeDefs } = require('./TypeDefs');
const { makeExecutableSchema } = require('graphql-tools');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = {
  schema
}

