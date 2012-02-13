
// Module dependencies.

var express = require('express');
var fact = require('./models/fact.js');
var router = require('./routes/api.js');

var app = module.exports = express.createServer();

// Configuration and middleware

// CORS middleware -- http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	next();
};

app.configure(function(){
  app.set('views', __dirname + '/public');
  app.set('view options', {layout: false});

	// make a custom html template: http://stackoverflow.com/questions/4529586/render-basic-html-view-in-node-js-express
	app.register('.html', {
		compile: function(str, options){
			return function(locals){
				return str;
			};
		}
	});

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

app.get('/', function(req, res) {
	return res.render('index.html');
});

// Main

app.listen(8124);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
