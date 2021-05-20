const { dummyAttractionsData } = require("../dummyData.js");
const {
  getLocation,
  getVisitors,
  getCoords,
  collateDataToObj,
} = require("../parseData.js");

describe("Test each function inside parse data", () => {
  it("getLocation()", () => {
    let res = getLocation(dummyAttractionsData);

    expect(res).toEqual({
      "Attraction 1": expect.any(Array),
      "Attraction 2": expect.any(Array),
      "Attraction 3": expect.any(Array),
    });
  });

  it("getVisitors()", () => {
    let res = getVisitors(dummyAttractionsData);

    expect(res).toEqual({
      "Attraction 1": 0,
      "Attraction 2": 2,
      "Attraction 3": 19,
    });
  });

  it("getCoords()", () => {
    let res = getCoords(dummyAttractionsData);

    expect(res).toEqual([
      ["Attraction 1", 0, "Point(60.572472222 56.893194444)"],
      [
        "Attraction 2",
        2,
        "Point(-77.03655 38.897669444)",
        "Point(-77.03655 38.897669444)",
        "Point(-77.03655 38.897669444)",
      ],
      [
        "Attraction 3",
        19,
        "Point(60.72222 56.893194)",
        "Point(60.72222 56.893194)",
      ],
    ]);
  });

  it("collateDataToObj()", () => {
    let res = collateDataToObj(dummyAttractionsData);

    expect(res).toEqual([
      {
        name: "Attraction 1",
        visitors: 0,
        coordinates: "Point(60.572472222 56.893194444)",
      },
      {
        name: "Attraction 2",
        visitors: 2,
        coordinates: "Point(-77.03655 38.897669444)",
      },
      {
        name: "Attraction 3",
        visitors: 19,
        coordinates: "Point(60.72222 56.893194)",
      },
    ]);
  });
});
