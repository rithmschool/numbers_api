
/*
 * This is basically our "controllers" that's just an adapter between the URL
 * and the models. Allows for easier redesign of URLs and APIs and such. Extra
 * layer of indirection also lets us add other logic here.
 */

exports.route = function(app, fact) {
	app.get('/:num', function(req, res) {
		var factStr = fact.getFact(req.param('num'), 'year', {});
		res.send(factStr, {'Content-Type': 'text/plain'}, 200);
	});
};
