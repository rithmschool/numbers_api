
/*
 * This is basically our "controllers" that's just an adapter between the URL
 * and the models. Allows for easier redesign of URLs and APIs and such. Extra
 * layer of indirection also lets us add other logic here.
 */

function factResponse(fact, req, res, num) {
	var factStr = '' + fact.getFact(num, req.param('type', 'trivia'), req.query);

	if (req.param('callback')) {  // JSONP
		res.json(factStr)
	} else {
		res.send(factStr, {'Content-Type': 'text/plain'}, 200);
	}
}

exports.route = function(app, fact) {

	app.get('/:num([0-9]+)/:type(year|trivia|math)?', function(req, res) {
		factResponse(fact, req, res, parseInt(req.param('num'), 10));
	});

	app.get('/:month([0-9]+)/:day([0-9]+)/:type(date)?', function(req, res) {
		var dayOfYear = new Date(0, req.param('month') - 1, req.param('day'));
		req.params.type = 'date';
		factResponse(fact, req, res, dayOfYear);
	});

	app.get('/random/:type?', function(req, res) {
		factResponse(fact, req, res, 'random');
	});

};
