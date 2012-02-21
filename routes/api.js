var _ = require('underscore');

/*
 * This is basically our "controllers" that's just an adapter between the URL
 * and the models. Allows for easier redesign of URLs and APIs and such. Extra
 * layer of indirection also lets us add other logic here.
 */

function factResponse(fact, req, res, num) {
	var factObj = fact.getFact(num, req.param('type', 'trivia'), req.query);
	var factStr = '' + factObj.text;

	// TODO: Maybe let the user turn off htis custom header? SHoudl definitely
	// support JSON to return this crap and other cruft.
	res.header('X-Numbers-API-Number', factObj.number);

	if (req.param('callback')) {  // JSONP
		res.json(factStr)
	} else if (req.param('write') !== undefined) {
		var script = 'document.write("' + _.escape(factStr) + '");';
		res.send(script, {'Content-Type': 'text/javascript'}, 200);
	} else {
		res.send(factStr, {'Content-Type': 'text/plain'}, 200);
	}
}

// TODO: there's also a copy in public/js/script.js. create a single shared copy
var MONTH_DAYS = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
function dateToDayOfYear(date) {
  var day = 0;
  for (var i = 0; i < date.getMonth(); ++i) {
    day += MONTH_DAYS[i];
  }
  return day + date.getDate();
}

exports.route = function(app, fact) {
	app.get('/:num(-?[0-9]+)/:type(date|year|trivia|math)?', function(req, res) {
		factResponse(fact, req, res, parseInt(req.param('num'), 10));
	});

	app.get('/:month(-?[0-9]+)/:day(-?[0-9]+)/:type(date)?', function(req, res) {
		var date = new Date(0, req.param('month') - 1, req.param('day'));
    var dayOfYear = dateToDayOfYear(date);
		req.params.type = 'date';
		factResponse(fact, req, res, dayOfYear);
	});

	app.get('/random/:type?', function(req, res) {
		factResponse(fact, req, res, 'random');
	});

};
