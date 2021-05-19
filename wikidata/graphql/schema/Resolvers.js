const { fieldToFieldConfig } = require("@graphql-tools/utils");
const parseData = require("../../parseData");
const attractions = require("../../attractionsRawData");
const museums = require("../../museumsRawData");

let attractionsData = parseData(attractions);
let museumsData = parseData(museums);

const resolvers = {
  Query: {
    getAttractions(parent, args) {
      const { keyword } = args;
      let filtered = attractionsData.filter((a) =>
        a["name"].toLowerCase().includes(keyword.toLowerCase())
      );
      return filtered;
    },
    getMuseums(parent, args) {
      const { keyword } = args;
      let filtered = museumsData.filter((a) =>
        a["name"].toLowerCase().includes(keyword.toLowerCase())
      );
      return filtered;
    },
  },
};

module.exports = { resolvers };
