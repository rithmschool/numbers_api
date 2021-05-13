const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Number {
      number: Int!
      math: [String!]!
      trivia: [String!]!
      date: [String!]!
      year: [String!]!
    }

    # Queries
    type Query {
      getFacts(number: Int!): Number!
    }
`;

module.exports = { typeDefs };



    