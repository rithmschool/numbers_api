var _ = require("underscore");
var fs = require("fs");
var utils = require("../public/js/shared_utils.js");

var BATCH_LIMIT = 100;

exports.appendToFile = function (filePath, dataStr) {
  var stream = fs.createWriteStream(filePath, {
    flags: "a",
    encoding: "utf8",
    mode: 0666,
  });
  stream.write(dataStr);
  stream.destroySoon();
};

function setExpireHeaders(res) {
  res.set("Pragma", "no-cache");
  res.set("Cache-Control", "no-cache");
  res.set("Expires", 0);
}

/*
 * This is basically our "controllers" that's just an adapter between the URL
 * and the models. Allows for easier redesign of URLs and APIs and such. Extra
 * layer of indirection also lets us add other logic here.
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
  function factObjStr() {
    return JSON.stringify(factObj, null, " ");
  }

  res.set("X-Numbers-API-Number", factObj.number);
  res.set("X-Numbers-API-Type", factObj.type);
  setExpireHeaders(res);

  if (req.params.callback) {
    // JSONP
    res.json(useJson ? factObj : factStr);
  } else if (req.params.write !== undefined) {
    var arg = useJson ? factObjStr() : '"' + _.escape(factStr) + '"';
    var script = "document.write(" + arg + ");";
    res.set("Content-Type", "text/javascript").send(script);
  } else {
    if (useJson) {
      res.set("Content-Type", "application/json").send(factObjStr());
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

  function factsObjStr() {
    return JSON.stringify(factsObj, null, " ");
  }

  setExpireHeaders(res);

  if (req.params.callback) {
    // JSONP
    res.json(factsObj);
  } else if (req.params.write !== undefined) {
    var script = "document.write(" + factsObjStr() + ");";
    res.send(script, { "Content-Type": "text/javascript" }, 200);
  } else {
    res.send(factsObjStr(), { "Content-Type": "application/json" }, 200);
  }
}

exports.route = function (app, fact) {
  var allTypesRegex = "/:type(date|year|trivia|math)?";

  // parse a batch request string of (e.g. "1..3,10") into individual numbers
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

  app.get("/:num(-?[0-9]+)" + allTypesRegex, function (req, res) {
    var number = parseInt(req.params.num, 10);
    if (req.params.type === "date") {
      number = utils.dateToDayOfYear(new Date(2004, 0, number));
    }
    factResponse(fact, req, res, number);
  });

  app.get("/:num([-0-9.,]+)" + allTypesRegex, function (req, res) {
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

  app.get("/:month(-?[0-9]+)/:day(-?[0-9]+)/:type(date)?", function (req, res) {
    var dayOfYear = utils.monthDayToDayOfYear(req.params.month, req.params.day);
    req.params.type = "date";
    factResponse(fact, req, res, dayOfYear);
  });

  // TODO: currently returned json uses dayOfYear as key rather than "month/day".
  // consider returning "month/day"
  app.get("/:date([-0-9/.,]+)/:type(date)?", function (req, res) {
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
      return exports.monthDayToDayOfYear(splits[0], splits[1]);
    });
    req.params.type = "date";
    factsResponse(fact, req, res, nums);
  });

  app.get("/random/:type?", function (req, res) {
    factResponse(fact, req, res, "random");
  });
};
