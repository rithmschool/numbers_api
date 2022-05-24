var _ = require("underscore");
var fs = require("fs");
var utils = require("../public/js/shared_utils.js");
const express = require("express");
const router = new express.Router();
const fact = require("../models/fact.js");

var BATCH_LIMIT = 100;

function appendToFile(filePath, dataStr) {
  let stream = fs.createWriteStream(filePath, {
    flags: "a",
    encoding: "utf8",
    mode: "0666",
  });
  stream.write(dataStr);
  stream.destroySoon();
}

function setExpireHeaders(res) {
  res.set("Pragma", "no-cache");
  res.set("Cache-Control", "no-cache");
  res.set("Expires", 0);
}

/**
 * Helper function to stringify a fact/facts object
 * @param: either a fact or facts object
 * @returns: returns a JSON object.
 */
function stringifyObj(obj) {
  return JSON.stringify(obj, null, " ");
}

/* This function is called within the routes. The function takes in the fact object
*  from the fact.js file and a number, and sends a random fact about that number
*  back to the frontend.
   @param fact: This is the entire export from the fact.js file.
   @param req: The request object from the frontend
      - req.params.type can either be "undefined", "date", "trivia" or "math"
   @param res: The response object sent to the frontend
   @param num: The number for which a fact is being requested
*/

function factResponse(fact, req, res, num) {
  const type = req.params.type || "trivia";
  var factObj = fact.getFact({ number: num, type: type, options: req.query });
  var factStr = "" + factObj.text;

  var useJson =
    req.query.json !== undefined ||
    (req.header("Content-Type") || req.header("Accept") || "").includes(
      "application/json"
    ) === true;

  res.set("X-Numbers-API-Number", factObj.number);
  res.set("X-Numbers-API-Type", factObj.type);
  setExpireHeaders(res);

  if (req.query.callback) {
    // JSONP
    res.json(useJson ? factObj : factStr);
  } else if (req.query.write !== undefined) {
    var arg = useJson ? stringifyObj(factObj) : '"' + _.escape(factStr) + '"';
    var script = "document.write(" + arg + ");";
    res.set("Content-Type", "text/javascript").send(script);
  } else {
    if (useJson) {
      res.set("Content-Type", "application/json").send(stringifyObj(factObj));
    } else {
      res.set("Content-Type", 'text/plain; charset="UTF-8"').send(factStr);
    }
  }
}

// TODO: Refactor to have less duplicated code
/*
 * Similar to factResponse(), but supports returning facts for multiple numbers in order
 * support making batch requests
 */

function factsResponse(fact, req, res, nums) {
  var useJson =
    req.params.json !== undefined ||
    (req.header("Content-Type") || "").indexOf("application/json") !== -1;
  var factsObj = {};
  _.each(nums, function (num) {
    const type = req.params.type || "trivia";
    var factObj = fact.getFact({ number: num, type: type, options: req.query });
    if (useJson) {
      factsObj[num] = factObj;
    } else {
      factsObj[num] = "" + factObj.text;
    }
  });

  setExpireHeaders(res);

  if (req.query.callback) {
    // JSONP
    res.json(factsObj);
  } else if (req.query.write !== undefined) {
    var script = "document.write(" + stringifyObj(factsObj) + ");";
    res.status(200).set("Content-Type", "text/javascript").send(script);
  } else {
    res
      .status(200)
      .set("Content-Type", "application/json")
      .send(stringifyObj(factsObj));
  }
}

// exports.route = function (app, fact) {
var allTypesRegex = "/:type(date|year|trivia|math)?";

/**
/* Parses a batch request string into individual numbers.
 * 
 * @param rangesStr: This is the range of numbers (e.g. "1..3,10")
 * @param {*} parseValue: Accepts a callback function which parses data into a number
 * @returns an array of numbers
 */

function getBatchNums(rangesStr, parseValue) {
  var nums = [];
  var count = 0;
  var ranges = rangesStr.split(",");
  _.each(ranges, function (range) {
    var bounds = range.split("..");
    if (bounds.length == 1) {
      if (count == BATCH_LIMIT) {
        return;
      }
      nums.push(parseValue(bounds[0]));
    } else if (bounds.length == 2) {
      var minBound = parseValue(bounds[0]);
      var maxBound = parseValue(bounds[1]);
      for (var i = minBound; i <= maxBound; i++) {
        if (count == BATCH_LIMIT) {
          return;
        }
        nums.push(i);
        count++;
      }
    } else {
      console.log("Unexpected number of bounds in range: " + bounds.length);
    }
  });
  return nums;
}

/** GET /:num(-?[0-9]+) - gets a fact about a number or date (e.g. 5/4)
 *
 * Either returns a string with just the fact if no content-type specfication
 * OR
 * returns the JSON below if content-type "application/json" is specified
 *
 * => {
 *        "text": "200 is degrees in a human\"s field of vision (approximately).",
 *        "number": 200,
 *        "found": true,
 *        "type": "trivia"
 *    }
 **/

router.get("/:num(-?[0-9]+)" + allTypesRegex, function (req, res) {
  var number = parseInt(req.params.num, 10);

  // Handles the case where there is one number the type date (e.g. /#45/date)
  if (req.params.type === "date") {
    number = utils.dateToDayOfYear(new Date(2004, 0, number));
  }

  factResponse(fact, req, res, number);
});

/** GET /:num([-0-9.,]+) - gets facts about multiple numbers
 *
 * Either returns an object with just a key, value pair of number and fact
 * (e.g. "1": "1 is the loneliest number.") if no content-type is specified
 * OR
 * returns the JSON below if content-type "application/json" is specified
 *
 * => {
 *        "1": {
 *        "text": "1 is the number of dimensions of a line.",
 *        "number": 1,
 *        "found": true,
 *        "type": "trivia"
 *        },
 *        "2": {
 *        "text": "2 is the first magic number in physics.",
 *        "number": 2,
 *        "found": true,
 *        "type": "trivia"
 *        }
 *    }
 **/

router.get("/:num([-0-9.,]+)" + allTypesRegex, function (req, res) {
  if (
    !req.params.num.match(
      /^-?[0-9]+(\.\.-?[0-9]+)?(,-?[0-9]+(\.\.-?[0-9]+)?)*$/
    )
  ) {
    // 400: Bad request if bad match
    res.send("Invalid url", 400);
    return;
  }
  var nums = getBatchNums(req.params.num, function (numStr) {
    return parseInt(numStr, 0);
  });
  factsResponse(fact, req, res, nums);
});

/** GET /:month(-?[0-9]+)/:day(-?[0-9]+)/:type(date)? - gets a fact
 *  about a date of the year
 *
 * Either returns a string with just the date fact if no content-type is specified
 * OR
 * returns the JSON below if content-type "application/json" is specified
 *
 * => {
 *        "text": "February 11th is the day in 1919 that Friedrich Ebert (SPD), is elected President of Germany.",
 *        "year": 1919,
 *        "number": 42,
 *        "found": true,
 *        "type": "date"
 *    }
 **/

router.get("/:month(-?[0-9]+)/:day(-?[0-9]+)/:type(date)?", function (
  req,
  res
) {
  var dayOfYear = utils.monthDayToDayOfYear(req.params.month, req.params.day);
  req.params.type = "date";
  factResponse(fact, req, res, dayOfYear);
});

/** GET /:month(-?[0-9]+)/:day(-?[0-9]+)/:type(date)? - gets a fact
 *  about a date of the year
 *
 * Either returns a string with just the date fact if no content-type is specified
 * OR
 * returns the JSON below if content-type "application/json" is specified
 *
 * => {
 *        "text": "February 11th is the day in 1919 that Friedrich Ebert (SPD), is elected President of Germany.",
 *        "year": 1919,
 *        "number": 42,
 *        "found": true,
 *        "type": "date"
 *    }
 **/

// TODO: currently returned json uses dayOfYear as key rather than "month/day".
// consider returning "month/day"eq
router.get("/:date([-0-9/.,]+)/:type(date)?", function (req, res) {
  if (
    !req.params.date.match(
      /^(-?[0-9]+\/-?[0-9]+)(\.\.-?[0-9]+\/-?[0-9]+)?(,-?[0-9]+\/-?[0-9]+(\.\.-?[0-9]\/-?[0-9]+)?)*$/
    )
  ) {
    // 404 if bad match
    res.send("Invalid url", 404);
    return;
  }

  var nums = getBatchNums(req.params.date, function (dateStr) {
    var splits = dateStr.split("/");
    return utils.monthDayToDayOfYear(splits[0], splits[1]);
  });
  req.params.type = "date";
  factsResponse(fact, req, res, nums);
});

/** GET /random/:type? - gets a random fact
 *
 * Either returns a string with just the date fact if no content-type is specified
 * OR 
 * returns the JSON below if content-type "application/json" is specified
 *
 * => {
        "text": "1446 is the number of graphs with 9 vertices and 5 edges.",
        "number": 1446,
        "found": true,
        "type": "math"
      }
 **/
router.get("/random/:type?", function (req, res) {
  factResponse(fact, req, res, "random");
});

// // app.get("/type-time-highcharts", function (req, res) {
// //   res.json(highcharts.getTypeTimeHist());
// // });

// // app.get("/type-number-highcharts", function (req, res) {
// //   res.json(highcharts.getTypeNumberHist());
// // });

router.post("/submit", function (req, res) {
  appendToFile("./suggestions.json", JSON.stringify(req.body) + "\n");
  res.send(req.body);
});

module.exports = {
  appendToFile: appendToFile,
  numRoutes: router,
  factResponse: factResponse,
  factsResponse: factsResponse,
  setExpireHeaders: setExpireHeaders,
};
