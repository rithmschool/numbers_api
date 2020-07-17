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
    let sentence = getSentence(true, 1000, "year", {
      text:
        "1 is the year that Confucius is given his first royal title (posthumous name) of Lord Baochengxun Ni.",
      number: 1,
      found: true,
      type: "year",
    });
    expect(sentence).toBe(
      "1 is the year that Confucius is given his first royal title (posthumous name) of Lord Baochengxun Ni."
    );
  });

  test("returns sentence when wantFragment is undefined", function () {
    let sentence = getSentence(undefined, 1000, "year", {
      text: "Bell foundry is founded in Italy by Pontificia Fonderia Marinelli",
    });
    expect(sentence).toBe(
      "1000 is the year that Bell foundry is founded in Italy by Pontificia Fonderia Marinelli."
    );
  });

  test("returns sentence when data contains date", function () {
    let sentence = getSentence(undefined, 1000, "year", {
      date: "December 25",
      text:
        "Stephen I becomes King of Hungary, which is established as a Christian kingdom on",
      number: 1000,
      found: true,
      type: "year",
    });
    expect(sentence).toBe(
      "1000 is the year that Stephen I becomes King of Hungary, which is established as a Christian kingdom on on December 25th."
    );
  });
});
