
/*
 * This is basically our "controllers" that's just an adapter between the URL
 * and the models. Allows for easier redesign of URLs and APIs and such. Extra
 * layer of indirection also lets us add other logic here.
 */

// TODO Get rid of this function if not needed
function apiResponse(response, str) {
	response.send('' + str, {'Content-Type': 'text/plain'}, 200);
}

function factResponse(req, res, num) {
	// TODO process query param here

	apiResponse(fact.getFact(num, req.param('type', 'trivia'), {}));
}

exports.route = function(app, fact) {

	app.get('/:num([0-9]+)/:type(year|trivia|math)?', function(req, res) {
		factResponse(req, res, req.param('num'));
	});

	app.get('/:month([0-9]+)/:day([0-9]+)', function(req, res) {
		var dayOfYear = new Date(0, req.param('month') - 1, req.param('day'));
		req.params.type = 'date';
		factResponse(req, res, dayOfYear);
	});

	app.get('/random/:type?', function(req, res) {
		// TODO There's a bit of code duplication here
		apiResponse(res, fact.getRandomFact(req.param('type', 'trivia'), {}));
	});

};
