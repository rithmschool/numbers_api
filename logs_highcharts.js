var fs = require('fs');
var _ = require('underscore');
var utils = require('./public/js/shared_utils.js');

var UPDATE_FROM_LOGS_FREQUENCY = 1000 * 60 * 60 * 3;
var USAGE_HISTOGRAM_DAYS = 10;

// TODO: repetition of code here with the types
var FACT_TYPES = ['trivia', 'math', 'year', 'date'];
var typeTimeHistogram = {};
var typeNumberHistogram = {};

function updateStatsFromLogs() {
	// Clear the histogram first
	_.each(FACT_TYPES, function(key) {
		typeTimeHistogram[key] = {};
		typeNumberHistogram[key] = {};
	});

	fs.readdir('./logs', function(err, files) {
		_.each(files, function(file) {
			fs.readFile('./logs/' + file, 'utf-8', function(err, contents) {
				_.each(contents.split('\n'), function(logJson) {
					var logObj = null;

					try {
						logObj = JSON.parse(logJson);
					} catch(e) {
					}

					if (logObj) {
						try {
							reduceStats(logObj);
						} catch (e) {
							console.log('Failed reducing log file', file);
							console.log(e.message, e.stack);
						}
					}
				});
			})
		})
	});
}

function reduceStats(obj) {
	var timestamp = obj.time;
	var query = obj.query;
	var number = query.num || 'random';
	if (query.month && query.day) {
		number = utils.monthDayToDayOfYear(query.month, query.day);
	}
	var type = query.type || 'trivia';

	// There may be invalid types due to invalid user input
	if (!_.contains(FACT_TYPES, type)) return;

	// by time
	if (timestamp >= (new Date()).getTime() - 1000 * 60 * 60 * 24 * USAGE_HISTOGRAM_DAYS) {
		var date = new Date(timestamp);
		var flooredDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		var flooredTime = flooredDate.getTime();
		var hist = typeTimeHistogram[type];
		if (!hist[flooredTime]) {
			hist[flooredTime] = 0;
		}
		hist[flooredTime] += 1;
	}

	// By number
	hist = typeNumberHistogram[type];
	if (!hist[number]) {
		hist[number] = 0;
	}
	hist[number] += 1;
}

setTimeout(updateStatsFromLogs, 0);
setInterval(updateStatsFromLogs, UPDATE_FROM_LOGS_FREQUENCY);

function toHighchartsData(histogram, intKey) {
	var ret = {};
	_.each(histogram, function(hist, type) {
		ret[type] = _.map(hist, function(value, key) {
			if (intKey) key = +key;
			return [key, value];
		});
	});
	return ret;
}

exports.getTypeTimeHist = _.bind(toHighchartsData, null, typeTimeHistogram, true);
exports.getTypeNumberHist = _.bind(toHighchartsData, null, typeNumberHistogram);
