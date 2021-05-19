const attractData = require('../../attractions');
let attractions = attractData();
console.log(attractions)
const resolvers = {
  Query: {
    getAttractions(parent, args) {
      const { keyword } = args;
      let filtered = attractions.filter(a => a['name']
      .toLowerCase()
      .includes(keyword.toLowerCase()));
      return filtered;
    }
  },
};

module.exports = { resolvers };
