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

const _ = require("underscore");
const fs = require("fs");
const path = require("path");

function reader_norm(out, pathname, callback) {
  // TODO: more reliable checking if file is data file
  let files = fs.readdirSync(pathname);

  files.forEach((file) => {
    let data;
    let numbers;
    try {
      data = fs.readFileSync(path.join(__dirname, pathname, file), {
        encoding: "utf8",
      });
    } catch (e) {
      console.error(
        `Exception while reading file ${pathname + file}: ${e.message}`
      );
      return;
    }
    try {
      numbers = JSON.parse(data);
    } catch (e) {
      console.error(
        `Exception while parsing file, ${pathname + file}: ${e.message}`
      );
      return;
    }
    try {
      _.each(numbers, function (number_data, number_key) {
        let float_key = parseFloat(number_key, 10);
        if (isNaN(float_key)) {
          console.log(
            `Skipping invaid number_key, ${number_key} in file ${
              pathname + file
            }`
          );
          return;
        }

        // TODO: handle this during normalization
        if (!number_data || number_data.length === 0) {
          // console.log('Skipping empty number_data for float_key', float_key, 'in file', pathname + file);
          return;
        }

        if (!(float_key in out)) {
          out[float_key] = [];
        }
        let o = out[float_key];
        _.each(number_data, function (element) {
          if (!element.text || !element.text.length) {
            console.log(
              `Skipping empty file (element.text is falsey) ${pathname + file}`
            );
            return;
          }
          if (callback) {
            element = callback(element);
          }
          if (!element) {
            return;
          }
          const MIN_LENGTH = 20;
          const MAX_LENGTH = 150;
          if (!element.manual) {
            if (
              element.text.length < MIN_LENGTH ||
              element.text.length > MAX_LENGTH
            ) {
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
    } catch (e) {
      console.error(`Exception while iterating through data: ${e.message}`);
    }
  });
}

// Format is line separated facts of format <#> <t|m|d|y> <fact>
function reader_manual(outs, pathname, callbacks) {
  // TODO: more reliable checking if file is data file
  let files = fs.readdirSync(pathname);
  for (let file of files) {
    let data;
    try {
      data = fs.readFileSync(path.join(__dirname, pathname, file), {
        encoding: "utf8",
      });
    } catch (e) {
      console.error(
        `Exception while reading file, ${pathname + file}: ${e.message}`
      );
      return;
    }
    let lines = data.split(/\n(?:\s*\n)*/);
    let regex = /^([-]?\d+)\s+(\w+)\s+(.*)$/;
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (line.toUpperCase().indexOf("SENTINEL") >= 0) {
        break;
      }
      let matches = regex.exec(line);
      console.log("MATCHES: ", matches);
      if (!matches) {
        console.log(`Skipping invalid line ${line} in file ${pathname + file}`);
        continue;
      }
      let number = parseFloat(matches[1], 10);
      if (isNaN(number)) {
        console.log(
          `Skipping invaid number ${number} in file ${
            pathname + file
          } on line: ${line}`
        );
        continue;
      }
      let type = matches[2];
      if (type !== "y" && type !== "d" && type !== "m" && type !== "t") {
        console.error(
          `Invalid fact type in file: ${pathname + file} on line: ${line}`
        );
        continue;
      }

      let text = matches[3];
      if (!text || text.length === 0) {
        console.log(
          `Skipping empty fact in file: ${pathname + file} on line: ${line}`
        );
        continue;
      }

      let element = {
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
      let out = outs[type];
      if (!(number in out)) {
        out[number] = [];
      }
      let o = out[number];
      o.push(element);
    }
  }
}

let countBad = 0;
function normalize_common(element) {
  // do not return results that contain the number itself
  if (element.self) {
    return undefined;
  }
  let text = element.text.trim();
  if (element.pos !== "NP") {
    text = text[0].toLowerCase() + text.substring(1);
  }
  let lastChar = text.charAt(text.length - 1);
  let charCode = lastChar.charCodeAt(0);
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
let trivia_pathname = "models/trivia/";
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

let outs = {
  d: exports.date,
  y: exports.year,
  m: exports.math,
  t: exports.trivia,
};
let callbacks = {
  d: normalize_common,
  y: normalize_common,
  m: normalize_common,
  t: normalize_common,
};
reader_manual(outs, "models/manual/", callbacks);

// check for missing entries
(function () {
  let configs = [
    { category: "math", data: exports.math, min: 0, max: 251 },
    { category: "trivia", data: exports.trivia, min: 0, max: 251 },
    { category: "date", data: exports.date, min: 1, max: 367 },
    { category: "year", data: exports.year, min: -100, max: 2050 },
  ];

  _.each(configs, function (config) {
    _.each(_.range(config.min, config.max), function (index) {
      if (!config.data[index] || config.data[index].length === 0) {
        console.log(`Missing: ${config.category} : ${index}`);
      }
    });
  });
})();

exports.reader_norm = reader_norm;
exports.reader_manual = reader_manual;
exports.normalize_common = normalize_common;
