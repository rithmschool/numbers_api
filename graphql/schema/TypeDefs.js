const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Number {
    math: [String!]!
    trivia: [String!]!
    date: [String!]!
    year: [String!]!
  }

  type Type {
    facts: [String!]!
  }

  # Queries
  type Query {
    getNumberFacts(number: Int!): Number!
    getTypeFacts(types: [String!]!, numbers: [Int!]!): Type!
  }
`;

module.exports = { typeDefs };

// [{10: {types: {math, date}}}, {}, {}]
