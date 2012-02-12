
/*
 * This is basically our "controllers".
 */

exports.home = function(req, res){
  res.render('index.jade', { title: 'Express' })
};

exports.asdf = function(req, res) {
	//res.redirect('/asdf.html');
	res.render('asdf.html');
	//res.send('hello, wrold', {'Content-Type': 'text/plain'}, 200);
};
