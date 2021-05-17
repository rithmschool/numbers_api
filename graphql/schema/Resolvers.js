const { types } = require("node-sass");
const { getAllFacts } = require("../../models/fact.js");


const resolvers = {
  Query: {
    getNumberFacts(parent, args) {
      let num = args.number;
      return getAllFacts(num);
    }
  },
};

module.exports = { resolvers };
