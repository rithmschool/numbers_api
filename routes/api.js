var _ = require('underscore');
var fs = require('fs');
var utils = require('../public/js/shared_utils.js');

var LOG_INTERVAL = 1000*60;
var MILLISECONDS_PER_DAY = 1000*60*60*24;
var BATCH_LIMIT = 100;

var logBuffer = [];

exports.appendToFile = function(filePath, dataStr) {
	var stream = fs.createWriteStream(filePath, {
			flags: 'a',
			encoding: 'utf8',
			mode: 0666
	});
  stream.write(dataStr);
  stream.destroySoon();
};

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
    var day = Math.floor((new Date()).getTime() / MILLISECONDS_PER_DAY);
    var filePath = 'logs/' + day + '.json';
    var dataStr = '';
    _.each(logBuffer, function(element) {
      dataStr += JSON.stringify(element) + '\n';
    });
    logBuffer = [];
    exports.appendToFile(filePath, dataStr);
  } catch (e) {
    console.log('Caught exception logging to file: ' + filePath, e);
  }
}, LOG_INTERVAL);

function setExpireHeaders(res) {
  res.header('Pragma', 'no-cache');
  res.header('Cache-Control', 'no-cache');
  res.header('Expires', 0);
}

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
	res.header('X-Numbers-API-Type', factObj.type);
  setExpireHeaders(res);

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

// TODO: Refactor to have less duplicated code
/*
 * Similar to factResponse(), but supports returning facts for multiple numbers in order
 * support making batch requests
 */
function factsResponse(fact, req, res, nums) {
  var useJson = (req.param('json') !== undefined ||
      (req.header('Content-Type') || '').indexOf('application/json') !== -1);
  var factsObj = {};
  _.each(nums, function(num) {
    var factObj = fact.getFact(num, req.param('type', 'trivia'), req.query);
    if (useJson) {
      factsObj[num] = factObj;
    } else {
      factsObj[num] = '' + factObj.text;
    }
  });

  function factsObjStr() {
    return JSON.stringify(factsObj, null, ' ');
  }

  setExpireHeaders(res);

  if (req.param('callback')) {  // JSONP
    res.json(factsObj);
  } else if (req.param('write') !== undefined) {
    var script = 'document.write(' + factsObjStr() + ');';
    res.send(script, {'Content-Type': 'text/javascript'}, 200);
  } else {
    res.send(factsObjStr(), { 'Content-Type': 'application/json' }, 200);
  }
}

exports.route = function(app, fact) {

  var allTypesRegex = '/:type(date|year|trivia|math)?';

  // parse a batch request string of (e.g. "1..3,10") into individual numbers
  function getBatchNums(rangesStr, parseValue) {
    var nums = [];
    var count = 0;
    var ranges = rangesStr.split(',');
    _.each(ranges, function(range) {
      var bounds = range.split('..');
      if (bounds.length == 1) {
        if (count == BATCH_LIMIT) {
          return;
        }
        nums.push(parseValue(bounds[0]));
      } else if (bounds.length == 2) {
        var minBound = parseValue(bounds[0]);
        var maxBound = parseValue(bounds[1]);
        for (var i = minBound; i <= maxBound; i++) {
          if (count == BATCH_LIMIT) {
            return;
          }
          nums.push(i);
          count++;
        }
      } else {
        console.log('Unexpected number of bounds in range: ' + bounds.length);
      }
    });
    return nums;
  }


	app.get('/:num(-?[0-9]+)' + allTypesRegex, function(req, res) {
    logRequest(req);
		var number = parseInt(req.param('num'), 10);
		if (req.param('type') === 'date') {
			number = utils.dateToDayOfYear(new Date(2004, 0, number));
		}
		factResponse(fact, req, res, number);
	});

  app.get('/:num([-0-9.,]+)' + allTypesRegex, function(req, res)  {
    logRequest(req);

    if (!req.param('num').match(/^-?[0-9]+(\.\.-?[0-9]+)?(,-?[0-9]+(\.\.-?[0-9]+)?)*$/)) {
      // 400: Bad request if bad match
      res.send('Invalid url', 400);
      return;
    }

    var nums = getBatchNums(req.param('num'), function(numStr) {
      return parseInt(numStr, 0);
    });
    factsResponse(fact, req, res, nums);
  });

	app.get('/:month(-?[0-9]+)/:day(-?[0-9]+)/:type(date)?', function(req, res) {
    logRequest(req);
		var dayOfYear = utils.monthDayToDayOfYear(req.param('month'), req.param('day'));
		req.params.type = 'date';
		factResponse(fact, req, res, dayOfYear);
	});

  // TODO: currently returned json uses dayOfYear as key rather than "month/day".
  // consider returning "month/day"
  app.get('/:date([-0-9/.,]+)/:type(date)?', function(req, res) {
    logRequest(req);

    if (!req.param('date').match(/^(-?[0-9]+\/-?[0-9]+)(\.\.-?[0-9]+\/-?[0-9]+)?(,-?[0-9]+\/-?[0-9]+(\.\.-?[0-9]\/-?[0-9]+)?)*$/)) {
      // 404 if bad match
      res.send('Invalid url', 404);
      return;
    }

    var nums = getBatchNums(req.param('date'), function(dateStr) {
      var splits = dateStr.split('/');
      return exports.monthDayToDayOfYear(splits[0], splits[1]);
    });
    req.params.type = 'date';
    factsResponse(fact, req, res, nums);
  });

	app.get('/random/:type?', function(req, res) {
    logRequest(req);
		factResponse(fact, req, res, 'random');
	});

};
