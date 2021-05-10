const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");

const app = new express();

app.use('/graphql', graphqlHTTP({
    schema
}));

/** year: 24
 * [
 * {"text": "The Roman war against Numidia and Mauretania ends with their annexation.", "self": false, "pos": "DET"},
 *  {"text": "Servius Cornelius Cethegus and Lucius Visellius Varro become consuls.", "self": false, "pos": "NP"}, 
 * {"text": "Charmides becomes Archon of Athens.", "self": false, "pos": "NP"},
 *  {"text": "Tacfarinas' revolt in Africa is repressed.", "self": false, "pos": "NP"},
 *  {"text": "Philo declares that the Old Testament is the eternal law of God.", "self": false, "pos": "NP"}
 * ]
 */

/** date: 24
 * [
 * {"text": "The Council of Basel suspends Pope Eugene IV as Prelate of Ethiopia, arrives at Massawa from Goa.", "self": false, "pos": "DET", "year": 1438}, 
 * {"text": "Charles VII Albert becomes Holy Roman Emperor.", "self": false, "pos": "NP", "year": 1742},
 *  {"text": "The University of Calcutta is formally founded as the first fully-fledged university in south Asia.", "self": false, "pos": "DET", "year": 1857}
 * ]
 * 
 */

/** math: 24
 * [
 * {"text": "The factorial of 4 and a composite number, being the first number of the form 23q, where q is an odd prime.", "self": false, "pos": "DET"},
 *  {"text": "A highly composite number, having more divisors than any smaller number.", "self": false, "pos": "DET"}
 * ]
 */

/** trivia: 24
 * [

      {
         "manual": true,
         "self": false,
         "text": "the number of books in the Tanakh"
      },
      {
         "manual": true,
         "self": false,
         "text": "the number of teams that participated in each FIFA World Cup finals tournament between 1982 and 1994"
      },

      {

         "manual": true,
         "self": false,
         "text": "the number of accepted runners in the Melbourne Cup"

      },
 */
module.exports = app;
