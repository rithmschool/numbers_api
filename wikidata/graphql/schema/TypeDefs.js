const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Destination {
    name: String!
    visitors: Int!
    coordinates: String!
  }

  # Queries
  type Query {
    getAttractions(keyword: String!): [Destination!]!
    getMuseums(keyword: String!): [Destination!]!
    getVisitors(type: String!, operator: String!, count: Int!): [Destination!]!
  }
`;

module.exports = { typeDefs };
