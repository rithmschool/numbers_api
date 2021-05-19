const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Attraction {
    name: String!
    visitors: Int!
    coordinates: String!
  }

  type Museum {
    name: String!
    visitors: String!
    coordinates: String!
  }

  # Queries
  type Query {
    getAttractions(keyword: String!): [Attraction!]!
    getMuseums(keyword: String!): [Museum!]!
  }
`;

module.exports = { typeDefs };
