var _ = require('underscore');
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
	// FIXME Should make an effort to return the random number that actually has
	// an associated fact

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

/**
 * @param number: If type is 'date', then number should be a date.
 * @param type: Currently supporting {trivia,date,math,year}
 */
exports.getFact = function(number, type, options) {
	// TODO query options

	// Default query param options
	_.defaults(options, {
	});

	if (number === 'random') {
		number = getRandomApiNum(type, options);
	}

	if (type === 'date') {
		number = '' + (number.getMonth() + 1) + '/' + number.getDate();
	}

	// TODO Better error handling
	// FIXME might return undefined

	var ret = data[type][number];
	if (ret === undefined) {
		return options['default'] || getDefaultMsg(number, type);
	} else {
		return ret;
	}
};
