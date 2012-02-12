var _ = require('underscore');
var data = require('./data.js');

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

function getRandomApiNum(type, options) {
	// TODO Should make an effort to return the random number that actually has
	// an associated fact

	console.log(JSON.stringify(options));

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

	// TODO Should max be exclusive?
	return randInt(min, max + 1);
}

/**
 * @param number: If type is 'date', then number should be a date.
 */
exports.getFact = function(number, type, options) {
	// TODO Parse options

	if (number === 'random') {
		number = getRandomApiNum(type, options);
	}

	if (type === 'date') {

	} else {
		// TODO Better error handling

		// FIXME might return undefined
		var ret = data[type][number];
		if (ret === undefined) {
			return 'None found for type ' + type + ' of number ' + number;
		} else {
			return ret;
		}
	}
};
