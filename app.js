console.log("\n\n\n=== ##### STARTING SERVER ##### ===\nat", new Date(), "\n");
// Module dependencies.

const fs = require("fs");
const express = require("express");
const https = require("https");
const marked = require("marked");
const _ = require("underscore");
const cors = require("cors");
const favicon = require("serve-favicon");
const errorhandler = require("errorhandler");
const nunjucks = require("nunjucks");

const fact = require("./models/fact.js");
const router = require("./routes/api.js");
// const secrets = require("./secrets.js");
// const highcharts = require("./logs_highcharts.js");
const utils = require("./public/js/shared_utils.js");

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
//   secrets.ADD_THIS_USERNAME +
//   "&password=" +
//   secrets.ADD_THIS_PASSWORD +
//   "&pubid=" +
//   secrets.ADD_THIS_PUBID;
// var GET_NUM_SHARES_INTERVAL_MS = 1000 * 30;
var numShares = 15;
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

const nodeEnv = process.env.NODE_ENV || "development";
const app = express();

// Configuration and middleware

nunjucks.configure("views/", {
  autoescape: true,
  express: app,
});

app.use(
  cors({ allowedHeaders: ["X-Requested-With", "Accept", "Content-Type"] })
);
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

router.route(app, fact);

var apiDocsHtml = marked(fs.readFileSync("README.md", "utf8"));

// TODO: Precompile this template.
app.get("/", function (req, res) {
  var currDate = new Date();
  res.render("index.html", {
    docs: apiDocsHtml,
    sharesFact: fact.getFact(numShares, "trivia", {
      notfound: "floor",
      fragment: true,
    }),
    numShares: numShares,
    dateFact: {
      day: currDate.getDate(),
      month: currDate.getMonth() + 1,
      data: fact.getFact(utils.dateToDayOfYear(currDate), "date", {}),
    },
  });
});

// app.get("/type-time-highcharts", function (req, res) {
//   res.json(highcharts.getTypeTimeHist());
// });

// app.get("/type-number-highcharts", function (req, res) {
//   res.json(highcharts.getTypeNumberHist());
// });

app.post("/submit", function (req, res) {
  router.appendToFile("./suggestions.json", JSON.stringify(req.body) + "\n");
  res.send(req.body);
});

module.exports = app;
