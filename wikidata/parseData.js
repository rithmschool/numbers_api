const attractions = require("./attractionsRawData.js");
const museums = require("./museumsRawData.js");

function getLocation(list) {
  let names = list.map((item) => {
    let nonName = /q[0-9]/i;
    if (!item["locationLabel"].match(nonName)) {
      return item["locationLabel"];
    }
  });

  let filteredNames = names.filter((name) => name !== undefined);
  let obj = {};
  filteredNames.forEach((name) => (obj[name] = []));
  return obj;
}

function getVisitors(list) {
  let names = getLocation(list);

  for (let name in names) {
    for (let item of list) {
      if (name === item["locationLabel"]) {
        names[name].push(item["visitors"]);
      }
    }
  }

  for (let name in names) {
    if (names[name].includes(undefined)) {
      names[name] = names[name].map((name) => {
        return name ? parseInt(name) : 0;
      });
    } else if (names[name][0] === "t") {
      names[name] = parseInt(names[name].substring(1));
    }

    let medianIdx = Math.floor(names[name].length / 2);
    names[name] = parseInt(names[name][medianIdx]);
  }
  return names;
}

function getCoords(list) {
  let array = Object.entries(getVisitors(list));

  for (let name of array) {
    for (let item of list) {
      if (name[0] === item["locationLabel"]) {
        name.push(item["cordinates"]);
      }
    }
  }

  return array;
}

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
