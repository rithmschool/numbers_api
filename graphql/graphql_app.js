const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const nodeEnv = process.env.NODE_ENV || "development";

const app = new express();
console.log('graphqlhttp here', graphqlHTTP)
app.use('/graphql', graphqlHTTP({

}));

module.exports = app;
