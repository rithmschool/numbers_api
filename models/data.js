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
const [MIN_LENGTH, MAX_LENGTH] = [20, 150];

function reader_norm(out, pathname, callback) {
  // TODO: more reliable checking if file is data file
  let files = fs.readdirSync(pathname);

  files.forEach((file) => {
    let data;
    let numbers;
    if (!file.includes(".txt")) {
      console.error(`Not a data file: ${pathname + file}`);
    }
    try {
      data = fs.readFileSync(pathname + file, {
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

        // if parsed data from numbers is valid
        // proceed to element normalization
        if (normalizeNumberData(float_key, number_data)) {
          // if key doesnt current exist in object, create it.
          if (!(float_key in out)) {
            out[float_key] = [];
          }
          // o -> array of number fact objects at the given key
          let o = out[float_key];
          number_data.forEach((element) => {
            if (!element.text || !element.text.length) {
              console.warn(
                `Skipping empty file (element.text is falsey) ${
                  pathname + file
                }`
              );
              return;
            }
            if (callback) {
              element = callback(element);
            }
            if (!element) {
              return;
            }

            o.push(element);
          });
          // TODO: should probably be performing this deletion also for early returns
          if (o.length === 0) {
            delete out[float_key];
          }
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
  files.forEach((file) => {
    let data;
    if (!file.includes(".txt")) {
      console.error(`Not a data file: ${pathname + file}`);
    }
    try {
      data = fs.readFileSync(pathname + file, {
        encoding: "utf8",
      });
    } catch (e) {
      console.error(
        `Exception while reading file, ${pathname + file}: ${e.message}`
      );
      return;
    }
    const lines = data.split(/\n(?:\s*\n)*/);
    const regex = /^([-]?\d+)\s+(\w+)\s+(.*)$/; // matches leading dashes followed by digits followed by whitespace followed by characters
    for (let line of lines) {
      if (line.toUpperCase().indexOf("SENTINEL") >= 0) {
        break;
      }
      let matches = regex.exec(line);
      if (!matches) {
        console.warn(
          `Skipping invalid line ${line} in file ${pathname + file}`
        );
        continue;
      }
      let number = parseFloat(matches[1], 10);
      if (isNaN(number)) {
        console.warn(
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
        console.warn(
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
        let callback = callbacks[type];
        element = callback(element);
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
  });
}

function normalizeNumberData(key, value) {
  if (isNaN(key)) {
    console.warn(
      `Skipping invalid number_key, ${number_key} in file ${pathname + file}`
    );
    return false;
  }

  if (!value || value.length === 0) {
    return false;
  }
  return true;
}

let countBad = 0;
function normalizeElement(element) {
  // do not return results that contain the number itself
  if (element.self) {
    return undefined;
  }
  let text = element.text.trim();
  // Converts first letter in text to lower-case if element.pos is NOT "NP"
  if (element.pos !== "NP") {
    let firstChar = text[0].toLowerCase();
    text = firstChar + text.slice(1);
  }
  let lastChar = text.charAt(text.length - 1);
  let charCode = lastChar.charCodeAt(0);
  if (lastChar === ".") {
    text = text.slice(0, text.length - 1);
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

  if (!element.manual) {
    if (element.text.length < MIN_LENGTH || element.text.length > MAX_LENGTH) {
      return;
    }
  }

  element.text = text;
  return element;
}

let date = {};
reader_norm(date, "models/date/norm/", function (element) {
  return normalizeElement(element);
});

let year = {};
reader_norm(year, "models/year/norm/", function (element) {
  return normalizeElement(element);
});

let trivia = {};
let trivia_pathname = "models/trivia/";
reader_norm(trivia, "models/trivia/norm/", function (element) {
  // TODO: include back non-manual results
  if (element.manual) {
    return normalizeElement(element);
  } else {
    return undefined;
  }
});

let math = {};
reader_norm(math, "models/math/norm/", function (element) {
  return normalizeElement(element);
});

let outs = {
  d: date,
  y: year,
  m: math,
  t: trivia,
};
let callbacks = {
  d: normalizeElement,
  y: normalizeElement,
  m: normalizeElement,
  t: normalizeElement,
};
reader_manual(outs, "models/manual/", callbacks);

// check for missing entries
(function () {
  let configs = [
    { category: "math", data: math, min: 0, max: 251 },
    { category: "trivia", data: trivia, min: 0, max: 251 },
    { category: "date", data: date, min: 1, max: 367 },
    { category: "year", data: year, min: -100, max: 2050 },
  ];

  _.each(configs, function (config) {
    _.each(_.range(config.min, config.max), function (index) {
      if (!config.data[index] || config.data[index].length === 0) {
        console.warn(`Missing: ${config.category} : ${index}`);
      }
    });
  });
})();

module.exports = {
  reader_norm,
  reader_manual,
  normalizeElement,
  math,
  trivia,
  date,
  year,
};
