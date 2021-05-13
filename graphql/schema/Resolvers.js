const { getAllFacts } = require("../../models/fact.js");

const resolvers = {
    Query: {
        getFacts(parent, args){
            let num = args.number;
            return getAllFacts(num);
        }
    }
}

module.exports = { resolvers };