const { ApolloServer } = require("apollo-server-express");
const { typeDefs } = require('./schema/TypeDefs');
const { resolvers } = require('./schema/Resolvers');
const express = require('express');
const app = express();

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

const PORT = 3001

app.listen({port: PORT}, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});