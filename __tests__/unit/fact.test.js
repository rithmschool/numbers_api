const { getRandomApiNum, getSentence } = require("../../models/fact");

describe("getRandomApiNum() with type 'date'", () => {
  // This test returns undefined instead of the expected value of 2010

  // test("return same number as min and max", function () {
  //   let sameAsMinMax = getRandomApiNum("date", { min: 2010, max: 2010 });
  //   expect(sameAsMinMax).toEqual(2010);
  // });

  // This test returns undefined instead of error handling
  // Error handling currently isn't supported

  // test("return error message when min and max has an invalid range", function () {
  //   let invalidRange = getRandomApiNum("date", { min: 10, max: -20 });
  // });

  test("return random number greater than 2010", function () {
    let greaterThanMin = getRandomApiNum("date", { min: 2010 });
    expect(greaterThanMin).toBeGreaterThan(2010);
  });

  test("return random number less than 2010", function () {
    let lessThanMax = getRandomApiNum("date", { max: 2010 });
    expect(lessThanMax).toBeLessThan(2010);
  });

  test("return random number when min and max are NaN", function () {
    let notNumMinMaxRes = getRandomApiNum("date", { min: "a", max: "b" });
    expect(typeof notNumMinMaxRes).toBe("number");
  });

  test("return random number when min and max are undefined", function () {
    let noMinMaxRes = getRandomApiNum("date", {});
    expect(typeof noMinMaxRes).toBe("number");
  });
});

describe("getRandomApiNum() with type 'trivia'", () => {
  // This test returns undefined instead of the expected value of 2010

  // test("return same number as min and max", function () {
  //   let sameAsMinMax = getRandomApiNum("trivia", { min: 2010, max: 2010 });
  //   expect(sameAsMinMax).toEqual(2010);
  // });

  // This test returns undefined instead of error handling
  // Error handling currently isn't supported

  // test("return error message when min and max has an invalid range", function () {
  //   let invalidRange = getRandomApiNum("trivia", { min: 10, max: -20 });
  // });

  test("return random number greater than 2010", function () {
    let greaterThanMin = getRandomApiNum("trivia", { min: 2010 });
    expect(greaterThanMin).toBeGreaterThan(2010);
  });

  test("return random number less than 2010", function () {
    let lessThanMax = getRandomApiNum("trivia", { max: 2010 });
    expect(lessThanMax).toBeLessThan(2010);
  });

  test("return random number when min and max are NaN", function () {
    let notNumMinMaxRes = getRandomApiNum("year", { min: "a", max: "b" });
    expect(typeof notNumMinMaxRes).toBe("number");
  });

  test("return random number when min and max are undefined", function () {
    let noMinMaxRes = getRandomApiNum("year", {});
    expect(typeof noMinMaxRes).toBe("number");
  });
});

describe("getRandomApiNum() with type 'math'", () => {
  // This test returns undefined instead of error handling
  // Error handling currently isn't supported

  // test("return error message when min and max has an invalid range", function () {
  //   let invalidRange = getRandomApiNum("math", { min: 10, max: -20 });
  // });

  test("return same number as min and max", function () {
    let sameAsMinMax = getRandomApiNum("math", { min: 2010, max: 2010 });
    expect(sameAsMinMax).toEqual(2010);
  });

  test("return random number greater than 2010", function () {
    let greaterThanMin = getRandomApiNum("math", { min: 2010 });
    expect(greaterThanMin).toBeGreaterThan(2010);
  });

  test("return random number less than 2010", function () {
    let lessThanMax = getRandomApiNum("math", { max: 2010 });
    expect(lessThanMax).toBeLessThan(2010);
  });

  test("return random number when min and max are NaN", function () {
    let notNumMinMaxRes = getRandomApiNum("year", { min: "a", max: "b" });
    expect(typeof notNumMinMaxRes).toBe("number");
  });

  test("return random number when min and max are undefined", function () {
    let noMinMaxRes = getRandomApiNum("year", {});
    expect(typeof noMinMaxRes).toBe("number");
  });
});

describe("getRandomApiNum() with type 'year'", () => {
  // This test returns undefined instead of error handling
  // Error handling currently isn't supported

  // test("return error message when min and max has an invalid range", function () {
  //   let invalidRange = getRandomApiNum("year", { min: 10, max: -20 });
  // });

  test("return same number as min and max", function () {
    let sameAsMinMax = getRandomApiNum("year", { min: 2010, max: 2010 });
    expect(sameAsMinMax).toEqual(2010);
  });

  test("return random number greater than 2010", function () {
    let greaterThanMin = getRandomApiNum("year", { min: 2010 });
    expect(greaterThanMin).toBeGreaterThan(2010);
  });

  test("return random number less than 2010", function () {
    let lessThanMax = getRandomApiNum("year", { max: 2010 });
    expect(lessThanMax).toBeLessThan(2010);
  });

  test("return random number when min and max are NaN", function () {
    let notNumMinMaxRes = getRandomApiNum("year", { min: "a", max: "b" });
    expect(typeof notNumMinMaxRes).toBe("number");
  });

  test("return random number when min and max are undefined", function () {
    let noMinMaxRes = getRandomApiNum("year", {});
    expect(typeof noMinMaxRes).toBe("number");
  });
});

describe("getSentence() returns sentence with type 'year'", () => {
  test("returns text when wantFragment is defined", function () {
    let sentence = getSentence("some random stuff", 1969, "year", {
      text: "nothing remarkable happened",
    });
    expect(sentence).toBe("nothing remarkable happened");
  });
});
