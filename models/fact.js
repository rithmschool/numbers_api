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

function randomChoice(array) {
	return array[randInt(0, array.length)];
}

function getRandomApiNum(type, options) {
	// TODO Should make an effort to return the random number that actually has
	// an associated fact?

	if (type === 'date') {
		return randDayOfYear();
	}

	var default_min = 1;
	var default_max = {
		'year': 2000,
		'trivia': 300,
		'math': 1000
	}[type];

	var min = Math.max(parseInt(options.min, 10) || 0, default_min);
	var max = Math.max(parseInt(options.max, 10) || default_max, min);

	return randInt(min, max + 1);
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
// PRE: data is sorted
var dataKeys = (function() {
	var ret = {};
	_.each(data, function(value, key) {
		ret[key] = _.flatten([-Infinity,
			_.map(_.keys(value), function(val) { return parseFloat(val, 10); }),
		Infinity]);
		value['-Infinity'] = 'negative infinity';
		value['Infinity'] = 'infinity';
	});
	return ret;
})();

/**
 * @param number: If type is 'date', then number should be a date.
 * @param type: Currently supporting {trivia,date,math,year}
 * @param options:
 *	- default: message to return if no fact for that number
 *	- notfound: behaviour if no fact for that #:
 *		- floor: return largest available number less than or equal to number
 *		- ceil: return smallest available number greater than or equal to number
 *		- default: return a canned message that works with the flow of other messages,
 *			or the given default message if one is provided.
 */
exports.getFact = function(number, type, options) {

	// Default query param options
	var defaults = {};
	defaults[QUERY_NOT_FOUND] = NOT_FOUND.DEFAULT;
	_.defaults(options, defaults);

	if (number === 'random') {
		number = getRandomApiNum(type, options);
	}

	if (type === 'date') {
		number = '' + (number.getMonth() + 1) + '/' + number.getDate();
	}

	// TODO Better error handling (for out of dates), and for number is an invalid
	// number or NaN

	var ret = data[type][number];
  if (ret instanceof Array) {
    ret = randomChoice(ret);
    if (ret !== undefined && 'text' in ret) {
      return ret.text;
    }
  }

	// Handle the case of number not found
	if (options[QUERY_NOT_FOUND] === NOT_FOUND.DEFAULT) {
		return options[QUERY_DEFAULT] || getDefaultMsg(number, type);
	} else {
		var index = _.sortedIndex(dataKeys[type], parseInt(number,10));
		if (options[QUERY_NOT_FOUND] === NOT_FOUND.FLOOR) index--;
		return data[type][dataKeys[type][index]];
	}
};
