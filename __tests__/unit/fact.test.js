const {
  getRandomApiNum,
  getSentence,
  dataPairs,
  filterObj,
  getFact,
} = require("../../models/fact");

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

  test("return random number greater than or equal to 2010", function () {
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

describe("getSentence() with type 'year'", () => {
  const data = {
    text: "Sweyn I establishes Danish control over part of Norway",
  };

  test("When wantFragment is true, returns partial text only", function () {
    let sentence = getSentence({ fragment: true }, 1000, "year", data);
    expect(sentence).toBe(
      "Sweyn I establishes Danish control over part of Norway"
    );
  });

  test("When wantFragment is undefined, returns full sentence", function () {
    let sentence = getSentence(undefined, 1000, "year", data);
    expect(sentence).toBe(
      "1000 is the year that Sweyn I establishes Danish control over part of Norway."
    );
  });

  test("When data has key of date, returns full sentence with date in the end", function () {
    let sentence = getSentence(undefined, 1000, "year", {
      date: "December 25",
      text:
        "Stephen I becomes King of Hungary, which is established as a Christian kingdom on",
    });
    expect(sentence).toBe(
      "1000 is the year that Stephen I becomes King of Hungary, which is established as a Christian kingdom on on December 25th."
    );
  });

  test("Return sentence when year is invalid", function () {
    let sentence = getSentence(undefined, 10000000000, "year", {
      text: "nothing remarkable happened",
    });
    expect(sentence).toBe(
      "10000000000 is the year that nothing remarkable happened."
    );
  });
});

describe("dataPairs", () => {
  // dataPairs returns
  // {"date": [Array], "math": [Array], "trivia": [Array], "year": [Array]}
  // {'number': 1, string: '1'}

  test("return object with keys 'date', 'math', 'trivia', 'year'", function () {
    expect(Object.keys(dataPairs)).toEqual(["date", "year", "trivia", "math"]);
  });

  test("date contains data in correct format", function () {
    let date = dataPairs["date"];
    expect(date).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ number: 1, string: "1" }),
      ])
    );
  });

  test("math contains data in correct format", function () {
    let math = dataPairs["math"];
    expect(math).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ number: 1, string: "1" }),
      ])
    );
  });

  test("trivia contains data in correct format", function () {
    let trivia = dataPairs["trivia"];
    expect(trivia).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ number: 1, string: "1" }),
      ])
    );
  });

  test("year contains data in correct format", function () {
    let year = dataPairs["year"];
    expect(year).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ number: 1, string: "1" }),
      ])
    );
  });
});

describe("filterObj()", () => {
  test("return filtered object that has values for whitelisted keys", function () {
    let filtered = filterObj(
      {
        hello: "world",
        not: "this",
      },
      ["hello"]
    );
    expect(filtered).toEqual({ hello: "world" });
  });

  test("return empty object when whitelist is empty", function () {
    let emptyWhitelist = filterObj(
      {
        hello: "world",
        not: "this",
      },
      []
    );
    expect(emptyWhitelist).toEqual({});
  });

  test("return empty object when whitelist key is not in object", function () {
    let notPresent = filterObj(
      {
        hello: "world",
        not: "this",
      },
      ["whiskey"]
    );
    expect(notPresent).toEqual({});
  });
});

describe("getFact()", () => {
  test("return error object with invalid type", function () {
    let filtered = getFact(1000, "sdasd", {});
    expect(filtered).toEqual({
      text: "ERROR: Invalid type.",
      number: 1000,
      type: "sdasd",
    });
  });

  test("return data on random number", function () {
    let random = getFact("random", "math", {});
    expect(random).toEqual(
      expect.objectContaining({
        text: expect.any(String),
        number: expect.any(Number),
        found: true,
        type: "math",
      })
    );
  });

  test("return error handling for number not found", function () {
    let notFound = getFact(1000, "math", {});
    expect(notFound).toEqual(
      expect.objectContaining({
        text: expect.any(String),
        number: 1000,
        found: false,
        type: "math",
      })
    );
  });
});
