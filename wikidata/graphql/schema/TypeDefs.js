const { gql } = require("apollo-server-express");

const typeDefs = gql`

  type Attraction {
    name: String!
    visitors: Int!
    coordinates: String!
  }

  # Queries
  type Query {
    getAttractions(keyword: String!): [Attraction!]!
  }
  
`;

module.exports = { typeDefs };


