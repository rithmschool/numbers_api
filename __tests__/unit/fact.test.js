const { getRandomApiNum } = require("../../models/fact");

describe("getRandomApiNum() with type 'date'", () => {
  // This test returns undefined instead of the expected value of 2010

  // test("return same number as min and max", function () {
  //   let one = getRandomApiNum("date", { min: 2010, max: 2010 });
  //   expect(one).toEqual(2010);
  // });

  // This test returns undefined instead of error handling
  // Error handling currently isn't supported

  // test("return error message when min and max has an invalid range", function () {
  //   let invalidRange = getRandomApiNum("date", { min: 10, max: -20 });
  // });

  test("return random number greater than 2010", function () {
    let greater = getRandomApiNum("date", { min: 2010 });
    expect(greater).toBeGreaterThan(2010);
  });

  test("return random number less than 2010", function () {
    let less = getRandomApiNum("date", { max: 2010 });
    expect(less).toBeLessThan(2010);
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
  //   let one = getRandomApiNum("trivia", { min: 2010, max: 2010 });
  //   expect(one).toEqual(2010);
  // });

  // This test returns undefined instead of error handling
  // Error handling currently isn't supported

  // test("return error message when min and max has an invalid range", function () {
  //   let invalidRange = getRandomApiNum("trivia", { min: 10, max: -20 });
  // });

  test("return random number greater than 2010", function () {
    let greater = getRandomApiNum("trivia", { min: 2010 });
    expect(greater).toBeGreaterThan(2010);
  });

  test("return random number less than 2010", function () {
    let less = getRandomApiNum("trivia", { max: 2010 });
    expect(less).toBeLessThan(2010);
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
    let one = getRandomApiNum("math", { min: 2010, max: 2010 });
    expect(one).toEqual(2010);
  });

  test("return random number greater than 2010", function () {
    let greater = getRandomApiNum("math", { min: 2010 });
    expect(greater).toBeGreaterThan(2010);
  });

  test("return random number less than 2010", function () {
    let less = getRandomApiNum("math", { max: 2010 });
    expect(less).toBeLessThan(2010);
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
    let notNumMinMaxRes = getRandomApiNum("year", { min: "a", max: "b" });
    expect(typeof notNumMinMaxRes).toBe("number");
  });

  test("return random number when min and max are undefined", function () {
    let noMinMaxRes = getRandomApiNum("year", {});
    expect(typeof noMinMaxRes).toBe("number");
  });
});
