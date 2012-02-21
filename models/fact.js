var _ = require('underscore');
var util = require('util');
var data = require('./data.js');

// TODO: There are a bunch of utils functions here that could be offshored
// to another file if they're ever needed elsewhere.

/**
 * @return {number} in [min, max) (inclusive-exclusive).
 */
function randInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

var randDayOfYear = (function() {
	var monthDays = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
	return function() {
		// TODO Make February 29 less likely
		var month = randInt(0, 12);
		var day = randInt(1, monthDays[month] + 1)
		return new Date(0, month, day);
	}
})();

function clamp(min, max, num) {
	return Math.max(min, Math.min(max, num));
}

function randomIndex(array) {
  return randInt(0, array.length);
}

function randomChoice(array) {
	return array[randInt(0, array.length)];
}

// http://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
function randomProperty(obj, pre) {
  var result;
  var count = 0;
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (Math.random() < 1/++count) {
        result = prop;
      }
    }
  }
  return result;
}

function getRandomApiNum(type, options) {
  var min = parseInt(options.min, 10);
  var max = parseInt(options.max, 10);
  if (isNaN(min) && isNaN(max)) {
    return randomChoice(dataKeys[type]);
  } else {
    if (isNaN(min)) {
      min = -Infinity;
    } else if (isNaN(max)) {
      max = Infinity;
    }
    // TODO: Use binary search here instead of O(n) linear search
    var valid_keys = _.filter(dataKeys[type], function(element) {
      return element >= min && element <= max;
    });
    return randomChoice(valid_keys);
  }
}

function getDefaultMsg(number, type) {
	var mathMsgs = _.map([
		'an uninteresting number',
		'a plain old number',
		'a boring number',
		'a most unremarkable number',
		'a number for which only Ramanujan could find an interesting property',
	], function(val) { return '' + number + ' is ' + val; });

	var defaultMsgs = {
		'math': mathMsgs,
		'trivia': mathMsgs,  // TODO Actually come up with trivia defaults
		'date': ['ERROR: Need to finish mining. Should be no default dates.'],
		'year': [
			'nothing remarkable happened.',
			'the Earth probably made about one revolution around the Sun.',
			'nothing interesting came to pass.',
			'we do not know what happened.',
		],
	}[type];

	return randomChoice(defaultMsgs);
}

// Mapping of meaning to query param value name
var NOT_FOUND = {
	DEFAULT: 'default',
	CEIL: 'ceil',
	FLOOR: 'floor',
	MISSING: '404',  // TODO
};

// Query parameter keys
var	QUERY_NOT_FOUND = 'notfound';
var QUERY_DEFAULT = 'default';

// Keys of each of the data mappings for use in binary search (unfortunately,
// _.map() on objects returns an array instead of an object). Pads with negative
// and positive infinity sentinels.
// Stores both the number as well as string representation of number as number representation is needed.
// Maybe this is not necessary, but too tired to think about it for now.
// PRE: data is sorted
var dataPairs = (function() {
	var ret = {};
	_.each(data, function(numbers, category) {
		ret[category] = _.sortBy(
      _.flatten([
        {'number': -Infinity, 'string': '-Infinity'},
        _.map(_.keys(numbers), function(number) {
          return {
            'number': parseFloat(number, 10),
            'string': number
          };
        }),
        {'number': Infinity, 'string': 'Infinity'}
      ]),
      function(pair) { return pair.number; }
    );
		numbers['-Infinity'] = [{ text: 'negative infinity' }];
		numbers['Infinity'] = [{ text: 'infinity' }];
	});
	return ret;
})();
// TODO: remove this, should be using dataPairs only. only reason this is here is because
// _.sortedIndex() is working as expected. need to investigate
var dataKeys = {}
_.each(dataPairs, function(pairs, category) {
  dataKeys[category] = _.map(pairs, function(pair) {
    return pair.number;
  });
});

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
exports.getFact = function(number, type, options) {

	// Default query param options
	var defaults = {};
	defaults[QUERY_NOT_FOUND] = NOT_FOUND.DEFAULT;
	_.defaults(options, defaults);

	if (!dataKeys[type]) {
		// TODO: Set HTTP status code as well
		return {
			text: "ERROR: Invalid type.",
			number: number,
		};
	}

	if (number === 'random') {
		number = getRandomApiNum(type, options);
	}

	// TODO Better error handling (for out of dates), and for number is an invalid
	// number or NaN

	var ret = data[type][number];
  if (ret instanceof Array) {
    ret = randomChoice(ret);
    if (ret !== undefined && 'text' in ret) {
      return {
				text: ret.text,
				number: number,
			};
    }
  }

	// Handle the case of number not found
	if (options[QUERY_NOT_FOUND] === NOT_FOUND.DEFAULT) {
		return {
			text: options[QUERY_DEFAULT] || getDefaultMsg(number, type),
			number: number,
		}
	} else {
		var index = _.sortedIndex(dataKeys[type], number);
		if (options[QUERY_NOT_FOUND] === NOT_FOUND.FLOOR) index--;
		var adjustedNum = dataPairs[type][index].string
		return {
			text: randomChoice(data[type][adjustedNum]).text,
			number: adjustedNum,
		};
	}
};
