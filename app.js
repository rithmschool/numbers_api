var fs = require('fs');

console.log('Starting server at: ', new Date());

// make a directory for log files if it does not exist
var logDirExists = false;
if (fs.existsSync) {
  logDirExists = fs.existsSync('logs');
} else {
  var path = require('path');
  logDirExists = path.existsSync('logs');
}
if (!logDirExists) {
  fs.mkdirSync('logs', 0777);
}


// Module dependencies.

var express = require('express');
var https = require('https');
var mustache = require('mustache');
var markdown = require('discount');
var _ = require('underscore');

var fact = require('./models/fact.js');
var router = require('./routes/api.js');
var secrets = require('./secrets.js');
var highcharts = require('./logs_highcharts.js');
var utils = require('./public/js/shared_utils.js');

// fake number of viistors
var BASE_VISITOR_TIME = new Date(1330560000000);
var VISITOR_RATE = 1000*60*60*3; // 3 hours/visitor
var lastVisitorTime = BASE_VISITOR_TIME;
var numVisitors = 0;

// TODO: Get rid of all these try catches, should use forever or something
// Periodically get # of shares from AddThis API (THANK YOU FOR SANE API, You
// are so much better than Google Analytics!!!)
var ADD_THIS_API_HOST = 'api.addthis.com';
var ADD_THIS_API_SHARE_PATH = '/analytics/1.0/pub/shares.json?userid=' +
	secrets.ADD_THIS_USERNAME + '&password=' + secrets.ADD_THIS_PASSWORD + '&pubid=' + secrets.ADD_THIS_PUBID;
var GET_NUM_SHARES_INTERVAL_MS = 1000 * 30;
var numShares = 15;

function updateNumShares() {
	var msg = '';
	try {

		https.get({
			host: ADD_THIS_API_HOST,
			path: ADD_THIS_API_SHARE_PATH,
			headers: {
				'Cache-Control': 'no-cache',
				'Pragma': 'no-cache',
			},
		}, function(res) {
			res.on('data', function(data) {
				msg += data.toString();

				try {
					// TODO: Get daily number of shares, hourly, etc. and display best value
					var dataObj = JSON.parse(msg);
					numShares = _.reduce(dataObj, function(accum, val) { return accum + val['shares']; }, 0) + 2;
				} catch (e) {
					console.log('Exception handling response from AddThis share:', e.message);
				}
			});
		}).on('error', function(e) {
			console.log("Got error: " + e.message);
		});

	} catch (e) {
		console.log('Exception getting number of shares:', e.message);
	}
}
setInterval(updateNumShares, GET_NUM_SHARES_INTERVAL_MS);


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
  app.use(express.favicon(__dirname + '/public/img/favicon.png', { maxAge: 2592000000 }));
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

var apiDocsHtml = markdown.parse(fs.readFileSync('README.md', 'utf8'));

// TODO: Precompile this template. Should also probably use a .mustache filename
// extension.
app.get('/', function(req, res) {
	// TODO: There's gotta be a way of using Express to get the template and not
	// just reading a file... (what's the RIGHT way of doing this)

  // TODO: we could put this back and alternate between # shares
  //var currTime = (new Date()).getTime();
  //if ((currTime - lastVisitorTime) >= VISITOR_RATE) {
  //  numVisitors += Math.round((currTime - lastVisitorTime) / VISITOR_RATE);
  //  lastVisitorTime = currTime;
  //}
  var currDate = new Date();
  res.render('index.html', {
    locals: {
      docs: apiDocsHtml,
      //visitorFact: fact.getFact(numVisitors, 'trivia', { notfound: 'floor', fragment: true }),
      //numVisitors: numVisitors,
      sharesFact: fact.getFact(numShares, 'trivia', { notfound: 'floor', fragment: true }),
      numShares: numShares,
      dateFact: {
        day: currDate.getDate(),
        month: currDate.getMonth() + 1,
        data: fact.getFact(utils.dateToDayOfYear(currDate), 'date', {}),
      },
    },
    partials: {}
  });
});

app.get('/type-time-highcharts', function(req, res) {
	res.json(highcharts.getTypeTimeHist());
});

app.get('/type-number-highcharts', function(req, res) {
	res.json(highcharts.getTypeNumberHist());
});

app.post('/submit', function(req, res) {
	router.appendToFile('./suggestions.json', JSON.stringify(req.body) + "\n");
	res.send(req.body);
});


// Main

app.listen(8124);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
