var _ = require('underscore');
var https = require('https');
var querystring = require('querystring');
var ga = require('googleanalytics')
var sys = require('util');

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
		//factResponse(fact, req, res, 'random');
    res.send('test', {'Content-Type': 'text/plain'}, 200);
	});

  app.get('/oauth2callback', function(req, res) {
    console.log('functon enter');

    redirect_uri = 'http://numbersapi.com/oauth2callback';
    client_id = '855274543054.apps.googleusercontent.com';
    client_secret = 'qGElHvVqmQqwFl1FLPgs8oAx';

    //auth_url = 'https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirect_uri + '&access_type=offline&scope=https://www.googleapis.com/auth/analytics.readonly';
    //console.log('auth_url', auth_url);

    var code = req.param('code');
    console.log('code', code);

    var access_token = req.param('access_token');
    console.log('access_token', access_token);

    var refresh_token = req.param('refresh_token');
    console.log('refresh_token', refresh_token);

    console.log('code', code);
    if (!code) {
      return;
    }

    var refresh_token = '1/5tF42ubjNidMLSgF9Dvw-3c6sFT-hxxlwysd8ZqyRHI';

    //var post_str = 'code=' + code + '&client_id=' + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirect_uri + '&grant_type=authorization_code';
    var post_str = '&client_id=' + client_id + '&client_secret=' + client_secret + '&refresh_token=' + refresh_token + '&grant_type=refresh_token';
    //post_str = _.escape(post_str);
    // An object of options to indicate where to post to
    var post_options = {
      host: 'accounts.google.com',
      port: '443',
      path: '/o/oauth2/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': post_str.length
      }
    };

    console.log('full url', 'https://accounts.google.com/o/oauth2/token/' + post_str);

    // Set up the request
    var post_req = https.request(post_options, function(res) {
      console.log('in request');
      res.setEncoding('utf8');
      try {
        console.log('access_token', res.param('access_token'));
      } catch (e) {
        console.log('e', e);
      }
      try {
        console.log('refresh_token', res.param('refresh_token'));
      } catch (e) {
        console.log('e', e);
      }
      res.on('data', function (chunk) {
        console.log('in response');
        console.log('Response: ' + chunk);
        var access_token = chunk['access_token'];

        /*
        // Look up only the last day of visits
        // var endDate = date( 'Y-m-d' );
        // var startDate = date( 'Y-m-d', strtotime( '-1 day' ) );
//            "ids" value comes from this URL in the last portion of the URL, after the "p": https://www.google.com/analytics/web/#dashboard/default/a381759w192893p9122283/
//            Or use http://code.google.com/apis/analytics/docs/gdata/gdataExplorer.html to show the GA ID for each your Analytics accounts
//            "key" is the API key that you'd set up in the Google APIs console, restricted to certain IP addresses
//
        //var post_options = {
        //  host: 'google.com',
        //  port: '443',
        //  path: '/analytics/feeds/data?ids=ga%3A56164542&metrics=ga%3Avisitors&start-date=2012-02-07&end-date=2012-02-21&max-results=50',
        //  method: 'GET',
        //  headers: {
        //    'Content-Type': 'application/x-www-form-urlencoded',
        //    'Content-Length': 0,
        //    'Authorization': 'Bearer ' + access_token
        //  }
        //};
        var api_key = 'AIzaSyCPHRUiASLNy9b2lJTqtFiICTYpan1H1WQ';
        var ids = 'ga:56164542'

        var options = {
          //'key': api_key,
          'ids': ids,
          'metrics': 'ga:visitors',
          'start-date': '2012-02-07',
          'end-date': '2012-02-21',
          'max-results': '50'
        }
        var qs = querystring.stringify(options);
        console.log('qs is', qs);
        var path = '/analytics/feeds/data?' + qs;
        //var path =  '/analytics/v3/data/ga?key=' + api_key + '&ids=' + ids + '&start-date=2012-02-07&end-date=2012-02-21&metrics=ga:pageviews&sort=-ga:pageviews&dimensions=ga:pagePath&max-results=10';
        console.log('path is', path);

        var post_options = {
          host: 'google.com',
          port: '443',
//path: _.escape('/analytics/v3/data/ga?key=' + api_key + '&ids=' + ids + '&start-date=2012-02-07&end-date=2012-02-21&metrics=ga:pageviews&sort=-ga:pageviews&dimensions=ga:pagePath&max-results=10'),
          path: path,
          //path: '/analytics/v3/data/ga?ids=ga%3A56164542&metrics=ga%3Avisitors%2Cga%3AnewVisits%2Cga%3Avisits%2Cga%3AavgTimeOnSite&start-date=2012-02-07&end-date=2012-02-21&max-results=50&key=AIzaSyB7kEC-MaLAnLgN-lGRwGfFf1kGPhYSlnw'
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': 0,
            'Authorization': 'Bearer ' + access_token
          }
        };


        // Set up the request
        var get_req = https.request(post_options, function(res) {
          console.log('res', res);
          res.on('data', function (chunk) {
            console.log('in response 2');
            console.log('Response 2: ' + chunk);
          });
        });

        //get_req.write(post_str);
        get_req.end();
        */
        var api_key = 'AIzaSyCPHRUiASLNy9b2lJTqtFiICTYpan1H1WQ';
        var ids = 'ga:56164542'
        var options = {
          'ids': ids,
          'start-date': '2010-09-01',
          'end-date': '2010-09-30',
          'dimensions': 'ga:pagePath',
          'metrics': 'ga:pageviews',
          'sort': '-ga:pagePath'
        };
        var GA = new ga.GA(options);
        GA.captureToken(options);
        GA.get(options, function(err, entries) {
          sys.debug(JSON.stringify(entries));
        });

        //var url = 'https://www.google.com/analytics/feeds/data?ids=ga%3A56164542&metrics=ga%3Avisitors&start-date=2012-02-07&end-date=2012-02-21&max-results=50'

        //$url = 'https://www.googleapis.com/analytics/v3/data/ga?' . 'key=AIzaSyDyWgfb45VYfVYdVnmpH4JZCCRNas5P0SE&ids=ga:9122283&start-date=' . $startDate . '&end-date=' . $endDate . '&metrics=ga:pageviews&sort=-ga:pageviews&dimensions=ga:pagePath&max-results=10';
      });
    });
    // post the data
    post_req.write(post_str);
    post_req.end();

    //curl_setopt( $ch, CURLOPT_URL, '' );
    //curl_setopt( $ch, CURLOPT_POST, 1);
    //curl_setopt( $ch, CURLOPT_POSTFIELDS, 'code=' . $_GET['code']. '&client_id=63311316168.apps.googleusercontent.com&client_secret=_iXNRZ5zMj1beMTab0wA4lXC&redirect_uri=http://www.theblog.ca/oauth2callback.php&grant_type=authorization_code');
    //curl_setopt( $ch, CURLOPT_RETURNTRANSFER,1 );
    //curl_setopt( $ch, CURLOPT_CONNECTTIMEOUT, $timeout );
    //$data = curl_exec( $ch );
    //curl_close( $ch );
    //$result = json_decode( $data, true );

    res.send('response one', {'Content-Type': 'text/plain'}, 200);
  });
};
