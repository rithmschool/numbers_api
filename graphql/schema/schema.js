const graphql = require("graphql");

const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLSchema } = graphql;

let numbers = {
    
}

const NumberType = new GraphQLObjectType({
    name: 'Number',
    fields: () => ({
        number: {type: GraphQLInt},
        type: {type: GraphQLString}
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        number: {
            type: NumberType,
            args: {number: {type: GraphQLInt}},
            resolve(parent, args) {
                // code to get data from db / other source
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})


