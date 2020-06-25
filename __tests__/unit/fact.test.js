const getRandomApiNum = require("../../models/fact");

describe("getRandomApiNum()", () => {
  test("return same year", function () {
    let one = getRandomApiNum("year", { min: 2010, max: 2010 });
    expect(one).toEqual(2010);
  });

  test("return random number greater than 2010", function () {
    let greater = getRandomApiNum("year", { min: 2010 });
    expect(greater).toBeGreaterThan(2010);
  });

  test("return random number less than 2010", function () {
    let less = getRandomApiNum("year", { max: 2010 });
    expect(less).toBeLessThan(2010);
  });

  test("return random number when min and max are NaN", function () {
    let randomNum = getRandomApiNum("year", { min: "a", max: "b" });
    expect(typeof randomNum).toBe("number");
  });
});
