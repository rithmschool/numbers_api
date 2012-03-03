var _ = require('underscore');
var fs = require('fs');

function reader(out, path, callback) {
  // TODO: more reliable checking if file is data file
  var files = fs.readdirSync(path);

  console.log('files: ', files);

  _.each(files, function(file) {
    // TODO: add encoding argument
    // TODO: fix directory so it's relative to directory of this file
    try {
      var data = fs.readFileSync(path + file);
    } catch (e) {
      console.error('Exception while reading file ', path + file, ': ', e.message);
      return;
    }

    try {
      var numbers = JSON.parse(data);
    } catch (e) {
      console.error('Exception while parsing file', path + file, ': ',  e.message);
      return;
    }

    // TODO: There should be a try/catch around this
    _.each(numbers, function(number_data, number_key) {
      float_key = parseFloat(number_key, 10);
      if (isNaN(float_key)) {
        console.log('Skipping invaid number_key', number_key, 'in file', path + file);
        return;
      }

      // TODO: handle this during normalization
      if (!number_data || number_data.length === 0) {
        // console.log('Skipping empty number_data for float_key', float_key, 'in file', path + file);
        return;
      }

      if (!(float_key in out)) {
        out[float_key] = [];
      }
      var o = out[float_key];

      _.each(number_data, function(element) {
				if (!element.text || !element.text.length) {
					console.log('Skipping empty file (element.text is falsey)', path + file);
					return;
				}
        // check if fact contains the number itself and discard it
        if (callback) {
          element = callback(element);
        }
        if (!element) {
          return;
        }
        if (element.text.length < 20 || element.text.length > 100) {
          return;
        }
        o[o.length] = element;
      });
      if (o.length === 0) {
        delete out[float_key];
      }
    });
  });
}

exports.date = {};
reader(exports.date, 'models/date/norm/', function(element) {
  var text = element.text;
  text = text.substring(0, text.length-1);
  if (element.pos !== 'NP') {
    text = text[0].toLowerCase() + text.substring(1);
  }
  if (element.date) {
    text = 'The day in ' + element.date + ' that ' + text;
  } else {
    text = 'The day that ' + text;
  }
  element.text = text + '.';
  return element;
});

exports.year = {};
reader(exports.year, 'models/year/norm/', function(element) {
  var text = element.text;
  text = text.substring(0, text.length-1);
  if (element.pos !== 'NP') {
    text = text[0].toLowerCase() + text.substring(1);
  }
  text = 'The year that ' + text;
  if (element.date) {
    text += ' on ' + element.date;
  }
  element.text = text + '.';
  return element;
});

exports.trivia = {};
var trivia_path = 'models/trivia/';
reader(exports.trivia, 'models/trivia/norm/', function(element) {
  // TODO: include back non-manual results
  if (element.manual && element.text) {
    var text = element.text;
    var text_lc = text.toLowerCase();
    if (text_lc.indexOf('the') !== 0 && text_lc.indexOf('number of') < 0) {
      text = 'the number of ' + text;
    }
    var first_letter = text.charAt(0);
    // uncapitalize the first letter. this should be okay for manual results since the first letter should be the word 'the'
    if (first_letter === first_letter.toUpperCase()) {
      text = first_letter.toLowerCase() + text.substring(1);
    }
    // add a period if it does not exist
    if (text.substring(text.length-1) === '.') {
      text = text.substring(0, text.length-1);
    }
    element.text = text
    return element;
  } else {
    return undefined;
  }
});

exports.math = {};
reader(exports.math, 'models/math/norm/', function(element) {
  // do not return results that contain the number itself
  if (element.self) {
    return null;
  }
  var text = element.text;
  text = text.substring(0, text.length-1);
  if (element.pos !== 'NP') {
    text = text[0].toLowerCase() + text.substring(1);
  }
  element.text =  'Is ' + text + '.';
  return element;
});

