const _ = require("underscore");
const data = require("./data.js");
const utils = require("../public/js/shared_utils.js");
console.log("data here", data.math["0"][0].text);
/**
 *
 * @param {object} options - if request has specified min or max they will be included here, otherwise options is an empty object.
 * @returns a random number that has at least one associated fact in our database.
 */
function getRandomApiNum(options) {
  let min = parseInt(options.min, 10);
  let max = parseInt(options.max, 10);

  // random num
  if (isNaN(min) && isNaN(max)) {
    return utils.randomChoice(dataKeys[options.type]);
  } else {
    if (isNaN(min)) {
      min = -Infinity;
    } else if (isNaN(max)) {
      max = Infinity;
    }

    // TODO: Use binary search here instead of O(n) linear search
    let valid_keys = _.filter(dataKeys[options.type], function (element) {
      return element >= min && element <= max;
    });

    return utils.randomChoice(valid_keys);
  }
}

/**
 * Function takes in the fact object and returns the fact text with a standardized prefix attached
 *
 * @param {object}
 *    wantFragment: if query param "fragment" exists, specifies that only text should be returned
 *    number: number requested
 *    type: date, math, trivia, or year
 *    data: object containing the number fact
 *
 * @returns: The text string fact with a standardized prefix attached
 */

function getSentence({ wantFragment, number, type, data }) {
  let { text, date } = data;
  if (wantFragment !== undefined) {
    // Because wantFragment could be a query field value
    return text;
  }

  const prefix = utils.getStandalonePrefix(number, type, data);

  if (type === "year" && date) {
    // format is 'December 25th'
    // TODO: should not just be storing string in data.date
    const month = date.replace(/(\w+) \d+/, "$1");
    const day = parseInt(date.replace(/\w+ (\d+)/, "$1"), 10);
    text = `${text} on ${month} ${utils.getOrdinalSuffix(day)}`;
  }

  return `${prefix} ${text}.`;
}

/**
 * Function returns a standardized message (from getSentence()) if a number fact does not
 * exist within the corresponding type.
 *
 * @param {object}
 *    number: number requested
 *    type: date, math, trivia, or year
 *    options: If request has specified min or max they will be included here, otherwise options is an empty object.
 *
 * @returns: The text string fact with a standardized prefix attached
 */

function getDefaultMsg({ number, type, options = {} }) {
  const mathMsgs = [
    "an uninteresting number",
    "a boring number",
    "an unremarkable number",
    "a number for which we're missing a fact",
  ];

  const yearMsgs = [
    "nothing remarkable happened",
    "the Earth probably went around the Sun",
    "nothing interesting came to pass",
    "we do not know what happened",
  ];

  const defaultMsgs = {
    math: mathMsgs,
    trivia: mathMsgs, // TODO Actually come up with trivia defaults
    date: ["no newsworthy events happened"],
    year: yearMsgs,
  }[type];

  const data = {
    text: `${utils.randomChoice(
      defaultMsgs
    )}. Have a better fact? Submit one at github.com/rithmschool/numbers_api`,
  };

  return getSentence({
    wantFragment: options.fragment,
    number,
    type,
    data,
  });
}

// Mapping of meaning to query param value name
const NOT_FOUND = {
  DEFAULT: "default",
  CEIL: "ceil",
  FLOOR: "floor",
  MISSING: "404", // TODO
};

// Query parameter keys
const QUERY_NOT_FOUND = "notfound";
const QUERY_DEFAULT = "default";

/* Keys of each of the data mappings for use in binary search (unfortunately,
   _.map() on objects returns an array instead of an object). Pads with negative
   and positive infinity sentinels.
   Stores both the number as well as string representation of number as number representation is needed.
   Data is sorted in ascending order.
   Maybe this is not necessary, but too tired to think about it for now.

   @returns: An object with number categories as keys (e.g. "math"). The value for each key
   is an array of objects which represent each of the possible numbers for each category 
   (e.g. { number: 70, string: '70' }). 
*/
const dataPairs = (function () {
  let ret = {};
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
let dataKeys = {};

/**
 * @param {object}
 *    dataPairs: Full object containing number/string pairs for all categories (e.g. math)
 *    pairs: the array of number/string objects for each category
 *    category: e.g. math or trivia
 * @returns: Just the number from the number/string object
 */
_.each(dataPairs, function (pairs, category) {
  dataKeys[category] = _.map(pairs, function (pair) {
    return pair.number;
  });
});

// Returns an object with the key "text". The value is the fact. Certain facts may also have a year key/value pair.
function filterObj(obj, whitelist) {
  return _.pick(obj, whitelist);
}

// This is a list of keys on the lowest-level fact objects that we will return
// with the API
const API_WHITELIST = ["text", "year", "date"];

// Copies properties from newObj into the result of filterObj()
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
function getFact({ number, type, options = {} }) {
  // number, type
  // Default query param options
  let defaults = {};
  defaults[QUERY_NOT_FOUND] = NOT_FOUND.DEFAULT;
  _.defaults(options, defaults);

  if (!dataKeys[type]) {
    // TODO: Set HTTP status code as well
    return {
      text: "ERROR: Invalid type.",
      number,
      type,
    };
  }

  if (number === "random") {
    options["type"] = type;
    number = getRandomApiNum(options);
  }

  // TODO Better error handling (for out of dates), and for number is an invalid
  // number or NaN

  let ret = data[type][number];

  if (ret instanceof Array) {
    ret = utils.randomChoice(ret);
    if (ret !== undefined && "text" in ret) {
      return apiExtend(ret, {
        text: getSentence({
          wantFragment: options.fragment,
          number,
          type,
          data: ret,
        }),
        number,
        found: true,
        type,
      });
    }
  }

  // Handle the case of number not found
  if (options[QUERY_NOT_FOUND] === NOT_FOUND.DEFAULT) {
    return {
      text: options[QUERY_DEFAULT] || getDefaultMsg({ number, type, options }),
      number,
      found: false,
      type,
    };
  } else {
    let index = _.sortedIndex(dataKeys[type], number);
    if (options[QUERY_NOT_FOUND] === NOT_FOUND.FLOOR) index--;
    let adjustedNum = dataPairs[type][index].string;
    ret = utils.randomChoice(data[type][adjustedNum]);
    return apiExtend(ret, {
      text: getSentence({
        wantFragment: options.fragment,
        number,
        type,
        data: ret,
      }),
      number: adjustedNum,
      found: false,
      type,
    });
  }
}

// get all facts and types that contains a number
function getAllFacts(num) {
  let res = {};
  let types = ["year", "date", "trivia", "math"];
  for (let type of types) {
    res[type] = data[type][num].map(({ text }) => text);
  }
  res.number = num;
  return res;
}
console.log(getAllFacts(24));

// Takes in a directory name, cleans data and writes that data to a new file.
function dumpData(dirname) {
  const fs = require("fs");

  _.each(data, function (typeObj, type) {
    let text = _.map(typeObj, function (factList, number) {
      return `${number}\n${_.pluck(factList, "text").join("\n")}`;
    }).join("\n\n");
    fs.writeFileSync(`${dirname}/${type}.txt`, text);
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
  getAllFacts,
};
