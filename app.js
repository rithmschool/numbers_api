console.log("\n\n\n=== ##### STARTING SERVER ##### ===\nat", new Date(), "\n");

// Module dependencies.
const fs = require("fs");
const express = require("express");
const https = require("https");
const _ = require("underscore");
const cors = require("cors");
const favicon = require("serve-favicon");
const errorhandler = require("errorhandler");
const nunjucks = require("nunjucks");
const mousewheel = require("jquery-mousewheel");
const marked = require("marked");
const apiDocsHtml = marked(fs.readFileSync("README.md", "utf8"));
const numShares = 15;

const getLocation = require("./wikidata/parseData.js");

const fact = require("./models/fact.js");
const { numRoutes } = require("./routes/numbers.js");
// const highcharts = require("./logs_highcharts.js");
const utils = require("./public/js/shared_utils.js");

require("dotenv").config();

const nodeEnv = process.env.NODE_ENV || "development";
const app = new express();

getLocation();

// fake number of viistors
// var BASE_VISITOR_TIME = new Date(1330560000000);
// var VISITOR_RATE = 1000 * 60 * 60 * 3; // 3 hours/visitor
// var lastVisitorTime = BASE_VISITOR_TIME;
// var numVisitors = 0;

// TODO: Get rid of all these try catches, should use forever or something
// Periodically get # of shares from AddThis API (THANK YOU FOR SANE API, You
// are so much better than Google Analytics!!!)
// var ADD_THIS_API_HOST = "api.addthis.com";
// var ADD_THIS_API_SHARE_PATH =
//   "/analytics/1.0/pub/shares.json?userid=" +
//   process.env.ADD_THIS_USERNAME +
//   "&password=" +
//   process.env.ADD_THIS_PASSWORD +
//   "&pubid=" +
//   process.env.ADD_THIS_PUBID;
// var GET_NUM_SHARES_INTERVAL_MS = 1000 * 30;
// var arguments = process.argv.splice(2);

// Dump all facts data to a directory
if (_.contains(arguments, "--dump")) {
  fact.dumpData("facts-dump");
  console.log("Dumped all fact data to directory facts-dump!");
  process.exit(0);
}

// function updateNumShares() {
//   var msg = "";
//   try {
//     https
//       .get(
//         {
//           host: ADD_THIS_API_HOST,
//           path: ADD_THIS_API_SHARE_PATH,
//           headers: {
//             "Cache-Control": "no-cache",
//             Pragma: "no-cache"
//           }
//         },
//         function (res) {
//           res.on("data", function (data) {
//             msg += data.toString();
//             try {
//               // TODO: Get daily number of shares, hourly, etc. and display best value
//               var dataObj = JSON.parse(msg);
//               numShares =
//                 _.reduce(
//                   dataObj,
//                   function (accum, val) {
//                     return accum + val["shares"];
//                   },
//                   0
//                 ) + 2;
//             } catch (e) {
//               console.log(
//                 "Exception handling response from AddThis share:",
//                 e.message
//               );
//             }
//           });
//         }
//       )
//       .on("error", function (e) {
//         console.log("Got error: " + e.message);
//       });
//   } catch (e) {
//     console.log("Exception getting number of shares:", e.message);
//   }
// }
// setInterval(updateNumShares, GET_NUM_SHARES_INTERVAL_MS);

// Configuration and middleware

nunjucks.configure("views/", {
  autoescape: true,
  express: app,
});

app.use(
  cors({ allowedHeaders: ["X-Requested-With", "Accept", "Content-Type"] })
);
app.use(express.json());
// app.set("views", __dirname + "/views");
app.enable("jsonp callback");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(
  favicon(__dirname + "/public/img/favicon.png", {
    maxAge: 2592000000,
  })
);

if (nodeEnv === "development") {
  app.use(errorhandler());
}

// Routes
app.use("/", numRoutes);

// TODO: Precompile this template.
// Route that renders the home page html
// source is ./README.md
app.get("/", function (req, res) {
  var currDate = new Date();
  res.render("index.html", {
    docs: apiDocsHtml,
    sharesFact: fact.getFact({
      notfound: "floor",
      fragment: true,
      type: "trivia",
      number: numShares,
    }),
    numShares: numShares,
    dateFact: {
      day: currDate.getDate(),
      month: currDate.getMonth() + 1,
      data: fact.getFact({
        type: "date",
        number: utils.dateToDayOfYear(currDate),
      }),
    },
  });
});

app.use("/js", express.static(__dirname + "/node_modules/jquery-mousewheel"));

module.exports = app;
