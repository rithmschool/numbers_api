const attractions = require("./attractionsRawData.js");
const museums = require("./museumsRawData.js");

/***
 * This function parses out valid location names from locationLabel
 * and de-dupes any duplicate names
 *
 * @params:
 *    [{location, cordinates, locationLabel, *visitor*}, {}]
 *      where *visitor* is optional
 *
 * @returns:
 *    {
 *      {"jeff's museum": []},
 *      {"art place": []},
 *      ...
 *    }
 */

function getLocation(list) {
  let names = list.map((item) => {
    // filter out locationLabel that start with "Q#"
    let nonName = /q[0-9]/i;
    if (!item["locationLabel"].match(nonName)) {
      return item["locationLabel"];
    }
  });

  // remove `undefined` elements
  let filteredNames = names.filter((name) => name !== undefined);

  // add remaining elements name as key to object
  // this de-dedupes the names
  let obj = {};
  filteredNames.forEach((name) => (obj[name] = []));

  return obj;
}

/**
 * This function parses out the median visitors for each location
 *
 * @params:
 *    [{location, cordinates, locationLabel, *visitor*}, {}]
 *      where *visitor* is optional
 *
 * @returns:
 *    {
 *      {"jeff's museum": 1},
 *      {"art place": 10}
 *    }
 */
function getVisitors(list) {
  let names = getLocation(list);

  // for each matching locationLabel, push the # of visitors into array
  // if visitor key is missing, pushes `undefined`
  for (let name in names) {
    for (let item of list) {
      if (name === item["locationLabel"]) {
        names[name].push(item["visitors"]);
      }
    }
  }

  for (let name in names) {
    // convert all `undefined` values to 0
    if (names[name].includes(undefined)) {
      names[name] = names[name].map((name) => {
        return name ? parseInt(name) : 0;
      });

      // attractions raw data occassionally has "t###" as visitors
      // remove the "t" and convert ### into int
    } else if (names[name][0] === "t") {
      names[name] = parseInt(names[name].substring(1));
    }

    // if there are more than 1 visitor values in array
    // get median value
    let medianIdx = Math.floor(names[name].length / 2);
    names[name] = parseInt(names[name][medianIdx]);
  }
  return names;
}


/**
 * @params:
 *    [{location, cordinates, locationLabel, *visitor*}, {}]
 * @returns 
 * array with objects that includes name, visitors, and coordinates
 * [["jeff's museum", 1, "Point(12, 35)"], ...]
 */
function getCoords(list) {
  //converts object into array
  let array = Object.entries(getVisitors(list));

  // adds coord as last element to array
  for (let name of array) {
    for (let item of list) {
      if (name[0] === item["locationLabel"]) {
        name.push(item["cordinates"]);
      }
    }
  }

  return array;
}



/**
 * @params:
 *    [{location, cordinates, locationLabel, *visitor*}, {}]
 * create objects from arrays, adding all results to larger array
 * sample array looks like: ["White House", 10, "Point(12, 34)"]
 * 
 * @returns 
 * [
 *  {name: "White House", visitors: 10, coordinates: "Point(12, 34)"},
 *  {name: "jeff's museum", visitors: 1, coordinates: "Point(12,35"},
 * ]
 */
function collateDataToObj(list) {
  let arrays = getCoords(list);

  return arrays.map((a) => {
    let obj = {};
    obj["name"] = a[0];
    obj["visitors"] = a[1];
    obj["coordinates"] = a[2];
    return obj;
  });
}

module.exports = collateDataToObj;
