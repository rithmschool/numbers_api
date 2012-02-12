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

/**
 * @param number: If type is 'date', then number should be a date.
 */
exports.getFact = function(number, type, options) {
	// TODO Parse options

	if (type === "date") {

	} else {
		// TODO Better error handling

		// FIXME might return undefined
		return data[type][number];
	}
};

exports.getRandomFact = function(type, options) {
	// TODO Should use constants and ranges from given default

	if (type === "date") {
		return exports.getFact(randDayOfYear(), type, options);
	} else {
		var num = randInt(1, 3);
		return exports.getFact(num, type, options);
	}
}
