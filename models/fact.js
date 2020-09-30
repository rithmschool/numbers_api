var _ = require("underscore");
var data = require("./data.js");
var utils = require("../public/js/shared_utils.js");

function getRandomApiNum(type, options) {
  var min = parseInt(options.min, 10);
  var max = parseInt(options.max, 10);

  if (isNaN(min) && isNaN(max)) {
    return utils.randomChoice(dataKeys[type]);
  } else {
    if (isNaN(min)) {
      min = -Infinity;
    } else if (isNaN(max)) {
      max = Infinity;
    }

    // TODO: Use binary search here instead of O(n) linear search
    var valid_keys = _.filter(dataKeys[type], function (element) {
      return element >= min && element <= max;
    });

    return utils.randomChoice(valid_keys);
  }
}

function getSentence(wantFragment, number, type, data) {
  var text = data.text;
  if (wantFragment !== undefined) {
    // Because wantFragment could be a query field value
    return text;
  }

  var prefix = utils.getStandalonePrefix(number, type, data);

  if (type === "year" && data.date) {
    // format is 'December 25th'
    // TODO: should not just be storing string in data.date
    var month = data.date.replace(/(\w+) \d+/, "$1");
    var day = parseInt(data.date.replace(/\w+ (\d+)/, "$1"), 10);
    text += " on " + month + " " + utils.getOrdinalSuffix(day);
  }

  return prefix + " " + text + ".";
}

function getDefaultMsg(number, type, options) {
  var mathMsgs = [
    "an uninteresting number",
    "a boring number",
    "an unremarkable number",
    "a number for which we're missing a fact (submit one to numbersapi at google mail!)",
  ];

  var defaultMsgs = {
    math: mathMsgs,
    trivia: mathMsgs, // TODO Actually come up with trivia defaults
    date: ["no newsworthy events happened"],
    year: [
      "nothing remarkable happened",
      "the Earth probably went around the Sun",
      "nothing interesting came to pass",
      "we do not know what happened",
    ],
  }[type];

  var data = {
    text: utils.randomChoice(defaultMsgs),
  };

  return getSentence(options.fragment, number, type, data);
}

// Mapping of meaning to query param value name
var NOT_FOUND = {
  DEFAULT: "default",
  CEIL: "ceil",
  FLOOR: "floor",
  MISSING: "404", // TODO
};

// Query parameter keys
var QUERY_NOT_FOUND = "notfound";
var QUERY_DEFAULT = "default";

// Keys of each of the data mappings for use in binary search (unfortunately,
// _.map() on objects returns an array instead of an object). Pads with negative
// and positive infinity sentinels.
// Stores both the number as well as string representation of number as number representation is needed.
// Maybe this is not necessary, but too tired to think about it for now.
// PRE: data is sorted
var dataPairs = (function () {
  var ret = {};
  _.each(data, function (numbers, category) {
    ret[category] = _.sortBy(
      _.flatten([
        { number: -Infinity, string: "-Infinity" },
        _.map(_.keys(numbers), function (number) {
          return {
            number: parseFloat(number, 10),
            string: number,
          };
        }),
        { number: Infinity, string: "Infinity" },
      ]),
      function (pair) {
        return pair.number;
      }
    );
    numbers["-Infinity"] = numbers["-Infinity"] || [
      { text: "negative infinity" },
    ];
    numbers["Infinity"] = numbers["Infinity"] || [{ text: "infinity" }];
  });
  return ret;
})();
// TODO: remove this, should be using dataPairs only. only reason this is here is because
// _.sortedIndex() is working as expected. need to investigate
var dataKeys = {};
_.each(dataPairs, function (pairs, category) {
  dataKeys[category] = _.map(pairs, function (pair) {
    return pair.number;
  });
});

function filterObj(obj, whitelist) {
  return _.pick(obj, whitelist);
}

// This is a list of keys on the lowest-level fact objects that we will return
// with the API
var API_WHITELIST = ["text", "year", "date"];

function apiExtend(obj, newObj) {
  return _.extend(filterObj(obj, API_WHITELIST), newObj);
}

/**
 * @param number: If type is 'date', then number should be day of year
 * @param type: Currently supporting {trivia,date,math,year}
 * @param options:
 *	- default: message to return if no fact for that number
 *	- notfound: behaviour if no fact for that #:
 *		- floor: return largest available number less than or equal to number
 *		- ceil: return smallest available number greater than or equal to number
 *		- default: return a canned message that works with the flow of other messages,
 *			or the given default message if one is provided.
 * @return {Object} A map with fields 'number' and 'text'
 */
function getFact(number, type, options) {
  // Default query param options
  var defaults = {};
  defaults[QUERY_NOT_FOUND] = NOT_FOUND.DEFAULT;
  _.defaults(options, defaults);

  if (!dataKeys[type]) {
    // TODO: Set HTTP status code as well
    return {
      text: "ERROR: Invalid type.",
      number: number,
      type: type,
    };
  }

  if (number === "random") {
    number = getRandomApiNum(type, options);
  }

  // TODO Better error handling (for out of dates), and for number is an invalid
  // number or NaN

  var ret = data[type][number];

  if (ret instanceof Array) {
    ret = utils.randomChoice(ret);
    if (ret !== undefined && "text" in ret) {
      return apiExtend(ret, {
        text: getSentence(options.fragment, number, type, ret),
        number: number,
        found: true,
        type: type,
      });
    }
  }

  // Handle the case of number not found
  if (options[QUERY_NOT_FOUND] === NOT_FOUND.DEFAULT) {
    return {
      text: options[QUERY_DEFAULT] || getDefaultMsg(number, type, options),
      number: number,
      found: false,
      type: type,
    };
  } else {
    var index = _.sortedIndex(dataKeys[type], number);
    if (options[QUERY_NOT_FOUND] === NOT_FOUND.FLOOR) index--;
    var adjustedNum = dataPairs[type][index].string;
    ret = utils.randomChoice(data[type][adjustedNum]);
    return apiExtend(ret, {
      text: getSentence(options.fragment, adjustedNum, type, ret),
      number: adjustedNum,
      found: false,
      type: type,
    });
  }
}

function dumpData(dirname) {
  var fs = require("fs");

  _.each(data, function (typeObj, type) {
    var text = _.map(typeObj, function (factList, number) {
      return "" + number + "\n" + _.pluck(factList, "text").join("\n");
    }).join("\n\n");
    fs.writeFileSync(dirname + "/" + type + ".txt", text);
  });
}

module.exports = {
  apiExtend,
  dataPairs,
  dumpData,
  filterObj,
  getDefaultMsg,
  getFact,
  getRandomApiNum,
  getSentence,
};
