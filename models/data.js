/**
 * Format of data:
 *
 * {
 *		date: {
 *				'12': [{
 *						'text': 'some string',
 *						'self': true,
 *						'manual': true,
 *						'pos': 'N',
 *						'year': 'optional year'
 *				}, {}, {}, {}, {}]
 *		},
 *		year:
 *		trivia:
 *		math:
 * }
 *
 */

var _ = require("underscore");
var fs = require("fs");

function reader_norm(out, path, callback) {
  // TODO: more reliable checking if file is data file
  var files = fs.readdirSync(path);

  // console.log("files: ", files);

  _.each(files, function (file) {
    // TODO: add encoding argument
    // TODO: fix directory so it's relative to directory of this file
    try {
      var data = fs.readFileSync(path + file, "utf8");
    } catch (e) {
      console.error(
        "Exception while reading file ",
        path + file,
        ": ",
        e.message
      );
      return;
    }

    try {
      var numbers = JSON.parse(data);
    } catch (e) {
      console.error(
        "Exception while parsing file",
        path + file,
        ": ",
        e.message
      );
      return;
    }

    // TODO: There should be a try/catch around this
    _.each(numbers, function (number_data, number_key) {
      float_key = parseFloat(number_key, 10);
      if (isNaN(float_key)) {
        // console.log(
        //   "Skipping invaid number_key",
        //   number_key,
        //   "in file",
        //   path + file
        // );
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

      _.each(number_data, function (element) {
        if (!element.text || !element.text.length) {
          // console.log(
          //   "Skipping empty file (element.text is falsey)",
          //   path + file
          // );
          return;
        }
        if (callback) {
          element = callback(element);
        }
        if (!element) {
          return;
        }
        if (!element.manual) {
          if (element.text.length < 20 || element.text.length > 150) {
            return;
          }
        }
        o[o.length] = element;
      });
      // TODO: should probably be performing this deletion also for early returns
      if (o.length === 0) {
        delete out[float_key];
      }
    });
  });
}

// Format is line separated facts of format <#> <t|m|d|y> <fact>
function reader_manual(outs, path, callbacks) {
  // TODO: more reliable checking if file is data file
  var files = fs.readdirSync(path);

  // console.log("files: ", files);

  _.each(files, function (file) {
    // TODO: fix directory so it's relative to directory of this file
    try {
      var data = fs.readFileSync(path + file, "utf8");
    } catch (e) {
      console.error(
        "Exception while reading file ",
        path + file,
        ": ",
        e.message
      );
      return;
    }

    var lines = data.split(/\n(?:\s*\n)*/);
    var regex = /^([-]?\d+)\s+(\w+)\s+(.*)$/;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (line.toUpperCase().indexOf("SENTINEL") >= 0) {
        break;
      }
      var matches = regex.exec(line);
      if (!matches) {
        // console.log("Skipping invaid line", line, "in file", path + file);
        continue;
      }
      var number = parseFloat(matches[1], 10);
      if (isNaN(number)) {
        // console.log(
        //   "Skipping invaid number",
        //   number,
        //   "in file",
        //   path + file,
        //   " on line: ",
        //   line
        // );
        continue;
      }
      var type = matches[2];
      if (type !== "y" && type !== "d" && type !== "m" && type !== "t") {
        console.error(
          "Invalid fact type in file: ",
          path + file,
          " on line: ",
          line
        );
        continue;
      }

      var text = matches[3];
      if (!text || text.length === 0) {
        // console.log(
        //   "Skipping empty fact in file: ",
        //   path + file,
        //   " on line: ",
        //   line
        // );
        continue;
      }

      var element = {
        text: text,
        self: false,
        manual: true,
      };

      if (type in callbacks) {
        element = callbacks[type](element);
      }
      if (!element) {
        continue;
      }

      var out = outs[type];
      if (!(number in out)) {
        out[number] = [];
      }
      var o = out[number];
      o.push(element);
    }
  });
}

var countBad = 0;
function normalize_common(element) {
  // do not return results that contain the number itself
  if (element.self) {
    return undefined;
  }
  var text = element.text.trim();
  if (element.pos !== "NP") {
    text = text[0].toLowerCase() + text.substring(1);
  }
  var lastChar = text.charAt(text.length - 1);
  var charCode = lastChar.charCodeAt(0);
  if (lastChar === ".") {
    text = text.substring(0, text.length - 1);
  } else if (
    (charCode < "a".charCodeAt(0) || charCode > "z".charCodeAt(0)) &&
    (charCode < "A".charCodeAt(0) || charCode > "Z".charCodeAt(0)) &&
    (charCode < "0".charCodeAt(0) || charCode > "9".charCodeAt(0)) &&
    lastChar !== ")" &&
    lastChar !== '"' &&
    lastChar !== "'"
  ) {
    // filter out results that do not end in '.', ')', or alphanumeric character as this is most
    // likely complex grammar that we do not support
    return undefined;
  }
  element.text = text;
  return element;
}

exports.date = {};
reader_norm(exports.date, "models/date/norm/", function (element) {
  return normalize_common(element);
});

exports.year = {};
reader_norm(exports.year, "models/year/norm/", function (element) {
  return normalize_common(element);
});

exports.trivia = {};
var trivia_path = "models/trivia/";
reader_norm(exports.trivia, "models/trivia/norm/", function (element) {
  // TODO: include back non-manual results
  if (element.manual) {
    return normalize_common(element);
  } else {
    return undefined;
  }
});

exports.math = {};
reader_norm(exports.math, "models/math/norm/", function (element) {
  return normalize_common(element);
});

var outs = {
  d: exports.date,
  y: exports.year,
  m: exports.math,
  t: exports.trivia,
};
var callbacks = {
  d: normalize_common,
  y: normalize_common,
  m: normalize_common,
  t: normalize_common,
};
reader_manual(outs, "models/manual/", callbacks);

// check for missing entries
(function () {
  var configs = [
    { category: "math", data: exports.math, min: 0, max: 251 },
    { category: "trivia", data: exports.trivia, min: 0, max: 251 },
    { category: "date", data: exports.date, min: 1, max: 367 },
    { category: "year", data: exports.year, min: -100, max: 2050 },
  ];

  _.each(configs, function (config) {
    _.each(_.range(config.min, config.max), function (index) {
      if (!config.data[index] || config.data[index].length === 0) {
        // console.log("Missing: " + config.category + ": " + index);
      }
    });
  });
})();
