var fs = require('fs');
var _ = require('underscore');

var UPDATE_FROM_LOGS_FREQUENCY = 1000 * 60 * 5;

var typeTimeHistogram = {
	'trivia': [],
	'math': [],
	'year': [],
	'date': [],
};

function updateStatsFromLogs() {
	// Clear the histogram first
	_.each(typeTimeHistogram, function(value, key) {
		typeTimeHistogram[key] = [];
	});

	fs.readdir('./logs', function(err, files) {
		_.each(files, function(file) {
			fs.readFile('./logs/' + file, 'utf-8', function(err, contents) {
				try {
					_.each(contents.split('\n'), function(logJson) {
						try {
							var logObj = JSON.parse(logJson);
							reduceStats(logObj);
						} catch(e) {
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
	var type = query.type;

	if (timestamp >= (new Date()).getTime() - 1000 * 60 * 60 * 24 * 7) {
		typeTimeHistogram[type].push([timestamp, 1]);
	}
}

setTimeout(updateStatsFromLogs, 0);
setInterval(updateStatsFromLogs, UPDATE_FROM_LOGS_FREQUENCY);

exports.getTypeTimeHist = function() {
	return typeTimeHistogram;
};
