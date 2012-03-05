var fs = require('fs');
var _ = require('underscore');

var UPDATE_FROM_LOGS_FREQUENCY = 1000 * 60 * 5;

var typeTimeHistogram = {
	'trivia': {},
	'math': {},
	'year': {},
	'date': {},
};

function updateStatsFromLogs() {
	// Clear the histogram first
	_.each(typeTimeHistogram, function(value, key) {
		typeTimeHistogram[key] = {};
	});

	fs.readdir('./logs', function(err, files) {
		_.each(files, function(file) {
			fs.readFile('./logs/' + file, 'utf-8', function(err, contents) {
				try {
					_.each(contents.split('\n'), function(logJson) {
						var logObj = null;
						try {
							logObj = JSON.parse(logJson);
						} catch(e) {
						}
						if (logObj) {
							reduceStats(logObj);
						}
					});
				} catch (e) {
					console.log('Failed reducing log files:', e.message);
				}
			})
		})
	});
}

function reduceStats(obj) {
	var timestamp = obj.time;
	var query = obj.query;
	var number = query.number || 'random';
	var type = query.type || 'trivia';

	if (timestamp >= (new Date()).getTime() - 1000 * 60 * 60 * 24 * 7) {
		var date = new Date(timestamp);
		var flooredDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		var flooredTime = flooredDate.getTime();
		var hist = typeTimeHistogram[type];
		if (!hist[flooredTime]) {
			hist[flooredTime] = 0;
		}
		hist[flooredTime] += 1;
	}
}

setTimeout(updateStatsFromLogs, 0);
setInterval(updateStatsFromLogs, UPDATE_FROM_LOGS_FREQUENCY);

exports.getTypeTimeHist = function() {
	var ret = {};
	_.each(typeTimeHistogram, function(hist, type) {
		ret[type] = [];
		_.each(hist, function(value, key) {
			ret[type].push([+key, value]);
		});
	});
	return ret;
};
