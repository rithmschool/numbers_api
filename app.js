
// Module dependencies.

var express = require('express');
var fact = require('./models/fact.js');
var router = require('./routes/api.js');
var mustache = require('mustache');
var markdown = require('discount');
var fs = require('fs');

// fake number of viistors
var BASE_VISITOR_TIME = new Date(1330560000000);
var VISITOR_RATE = 1000*60*60*3; // 3 hours/visitor
var lastVisitorTime = BASE_VISITOR_TIME;
var numVisitors = 0;

// From http://bitdrift.com/post/2376383378/using-mustache-templates-in-express
var mustacheTemplate = {
	compile: function (source, options) {
		if (typeof source == 'string') {
			return function(options) {
				options.locals = options.locals || {};
				options.partials = options.partials || {};
				if (options.body) // for express.js > v1.0
					locals.body = options.body;
				return mustache.to_html(
						source, options.locals, options.partials);
			};
		} else {
			return source;
		}
	},
	render: function (template, options) {
		template = this.compile(template, options);
		return template(options);
	}
};

var app = module.exports = express.createServer();

// Configuration and middleware

// CORS middleware -- http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
};

app.configure(function(){
  app.set('views', __dirname + '/public');
  app.set('view options', {layout: false});
	app.enable('jsonp callback');

	app.register('.html', mustacheTemplate);

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(allowCrossDomain);
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

router.route(app, fact);

// TODO: Precompile this template. Should also probably use a .mustache filename
// extension.
app.get('/', function(req, res) {
	// TODO: There's gotta be a way of using Express to get the template and not
	// just reading a file... (what's the RIGHT way of doing this)
  var currTime = (new Date()).getTime();
  if ((currTime - lastVisitorTime) >= VISITOR_RATE) {
    numVisitors += Math.round((currTime - lastVisitorTime) / VISITOR_RATE);
    lastVisitorTime = currTime;
  }
	fs.readFile('README.md', 'utf-8', function(err, data) {
    var currDate = new Date();
		res.render('index.html', {
			locals: {
        docs: markdown.parse(data),
        visitorFact: fact.getFact(numVisitors, 'trivia', { notfound: 'ceil', fragment: true }),
        dateFact: {
          day: currDate.getDate(),
          month: currDate.getMonth() + 1,
          data: fact.getFact(router.dateToDayOfYear(currDate), 'date', {}),
        },
      },
			partials: {}
		});
	});
});

// Main

app.listen(8124);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
