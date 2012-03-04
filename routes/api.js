var _ = require('underscore');
var fs = require('fs');

var logBuffer = [];
var logInterval = 1000*60;
var millisecondsPerDay = 1000*60*60*24;

function appendToFile(filePath, dataStr) {
  fs.open(filePath, 'a', 0666, function(e, id) {
    fs.writeSync(id, dataStr, 0, 'utf8');
  });
}

/**
 * logRequest a request. Start by logging to memory, and periodically empty to file
 */
function logRequest(req) {
  var query = {};
  _.extend(query, req.query);
  _.extend(query, req.params);
  logBuffer.push({
    headers: req.headers,
    query: query,
    time: (new Date()).getTime(),
  });
}

// logRequest to file asynchronously at set interval
setInterval(function() {
  try {
    var day = Math.floor((new Date()).getTime() / millisecondsPerDay);
    var filePath = 'logs/' + day + '.json';
    var dataStr = '';
    _.each(logBuffer, function(element) {
      dataStr += JSON.stringify(element) + '\n';
    });
    logBuffer = [];
    console.log('Logging to file: ' + filePath);
    appendToFile(filePath, dataStr);
  } catch (e) {
    console.log('Caught exception logging to file: ' + filePath, e);
  }
}, logInterval);

/*
 * This is basically our "controllers" that's just an adapter between the URL
 * and the models. Allows for easier redesign of URLs and APIs and such. Extra
 * layer of indirection also lets us add other logic here.
 */

function factResponse(fact, req, res, num) {
	var factObj = fact.getFact(num, req.param('type', 'trivia'), req.query);
	var factStr = '' + factObj.text;
	var useJson = (req.param('json') !== undefined ||
			(req.header('Content-Type') || '').indexOf('application/json') !== -1);
	function factObjStr() {
		return JSON.stringify(factObj, null, ' ');
	}

	res.header('X-Numbers-API-Number', factObj.number);
  res.header('Pragma', 'no-cache');
  res.header('Cache-Control', 'no-cache');
  res.header('Expires', 0);

	if (req.param('callback')) {  // JSONP
		res.json(useJson ? factObj : factStr);
	} else if (req.param('write') !== undefined) {
		var arg = useJson ? factObjStr() : '"' + _.escape(factStr) + '"';
		var script = 'document.write(' + arg + ');';
		res.send(script, {'Content-Type': 'text/javascript'}, 200);
	} else {
		if (useJson) {
			res.send(factObjStr(), { 'Content-Type': 'application/json' }, 200);
		} else {
			res.send(factStr, { 'Content-Type': 'text/plain; charset="UTF-8"' }, 200);
		}
	}
}

// TODO: there's also a copy in public/js/script.js. create a single shared copy
var MONTH_DAYS = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
exports.dateToDayOfYear = function(date) {
  var day = 0;
  for (var i = 0; i < date.getMonth(); ++i) {
    day += MONTH_DAYS[i];
  }
  return day + date.getDate();
}

exports.route = function(app, fact) {
	app.get('/:num(-?[0-9]+)/:type(date|year|trivia|math)?', function(req, res) {
    logRequest(req);
		var number = parseInt(req.param('num'), 10);
		if (req.param('type') === 'date') {
			number = exports.dateToDayOfYear(new Date(2004, 0, number));
		}
		factResponse(fact, req, res, number);
	});

	app.get('/:month(-?[0-9]+)/:day(-?[0-9]+)/:type(date)?', function(req, res) {
    logRequest(req);
		var date = new Date(2004, req.param('month') - 1, req.param('day'));
    var dayOfYear = exports.dateToDayOfYear(date);
		req.params.type = 'date';
		factResponse(fact, req, res, dayOfYear);
	});

	app.get('/random/:type?', function(req, res) {
    logRequest(req);
		factResponse(fact, req, res, 'random');
	});
};
