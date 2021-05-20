const { fieldToFieldConfig } = require("@graphql-tools/utils");
const { collateDataToObj } = require("../../parseData");
const attractions = require("../../attractionsRawData");
const museums = require("../../museumsRawData");
const {
  dummyMuseumsData,
  dummyAttractionsData,
} = require("../../__tests__/dummyData");

require("dotenv").config();
let attractionsData =
  process.env.NODE_ENV === "test"
    ? collateDataToObj(dummyAttractionsData)
    : collateDataToObj(attractions);
let museumsData =
  process.env.NODE_ENV === "test"
    ? collateDataToObj(dummyMuseumsData)
    : collateDataToObj(museums);

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
    getVisitors(parent, args) {
      const { type, operator, count } = args;
      let dataType;
      if (type === "museums") {
        dataType = museumsData;
      } else if (type === "attractions") {
        dataType = attractionsData;
      }

      // compares visitors to count using ">" ">=" "<" "<="
      return dataType.filter((data) =>
        eval(`${data["visitors"]} ${operator} ${count}`)
      );
    },
  },
};

module.exports = { resolvers };
