const attractions = require("./attractionsRawData.js");

function getLocation(list) {
  let names = list.map((a) => {
    let nonName = /q[0-9]/i;
    if (!a["locationLabel"].match(nonName)) {
      return a["locationLabel"];
    }
  });

  let filteredNames = names.filter((name) => name !== undefined);
  let obj = {};
  filteredNames.forEach((name) => (obj[name] = []));
  return obj;
}

function getVisitors() {
  let names = getLocation();

  for (let name in names) {
    for (let a of attractions) {
      if (name === a["locationLabel"]) {
        names[name].push(a["visitors"]);
      }
    }
  }

  for (let name in names) {
    if (names[name][0] === undefined) {
      names[name] = 0;
    } else if (names[name][0] === "t") {
      names[name] = names[name].substring(1);
    } else {
      let medianIdx = Math.floor(names[name].length / 2);
      names[name] = names[name][medianIdx];
    }
  }

  return names;
}

function getCoords() {
  let array = Object.entries(getVisitors());

  for (let name of array) {
    for (let a of attractions) {
      if (name[0] === a["locationLabel"]) {
        name.push(a["cordinates"]);
      }
    }
  }

  return array;
}

function makeObjs() {
  let arrays = getCoords();

  return arrays.map((a) => {
    let obj = {};
    obj["name"] = a[0];
    obj["visitors"] = a[1];
    obj["coordinates"] = a[2];
    return obj;
  });
}

module.exports = makeObjs;
