const {
  getRandomApiNum,
  getSentence,
  dataPairs,
  filterObj,
  apiExtend,
  getFact,
  dumpData,
  getDefaultMsg,
} = require("../../models/fact");
const fs = require("fs");

describe("getRandomApiNum() with type 'date'", () => {
  test("return random number greater than or equal to 2010", function () {
    let greaterThanMin = getRandomApiNum({ min: 2010, type: "date" });
    expect(greaterThanMin).toBeGreaterThan(2010);
  });

  test("return random number less than 2010", function () {
    let lessThanMax = getRandomApiNum({ max: 2010, type: "date" });
    expect(lessThanMax).toBeLessThan(2010);
  });

  test("return random number when min and max are NaN", function () {
    let invalidInputNum = getRandomApiNum({ min: "a", max: "b", type: "date" });
    expect(typeof invalidInputNum).toBe("number");
  });

  test("return random number when min and max are undefined", function () {
    let noMinMax = getRandomApiNum({ type: "date" });
    expect(typeof noMinMax).toBe("number");
  });
});

describe("getRandomApiNum() with type 'trivia'", () => {
  test("return random number greater than 2010", function () {
    let greaterThanMin = getRandomApiNum({ min: 2010, type: "trivia" });
    expect(greaterThanMin).toBeGreaterThan(2010);
  });

  test("return random number less than 2010", function () {
    let lessThanMax = getRandomApiNum({ max: 2010, type: "trivia" });
    expect(lessThanMax).toBeLessThan(2010);
  });

  test("return random number when min and max are NaN", function () {
    let invalidInputNum = getRandomApiNum({ min: "a", max: "b", type: "year" });
    expect(typeof invalidInputNum).toBe("number");
  });

  test("return random number when min and max are undefined", function () {
    let noMinMax = getRandomApiNum({ type: "year" });
    expect(typeof noMinMax).toBe("number");
  });
});

describe("getRandomApiNum() with type 'math'", () => {
  test("return same number as min and max", function () {
    let sameAsMinMax = getRandomApiNum({ min: 2010, max: 2010, type: "math" });
    expect(sameAsMinMax).toEqual(2010);
  });

  test("return random number greater than 2010", function () {
    let greaterThanMin = getRandomApiNum({ min: 2010, type: "math" });
    expect(greaterThanMin).toBeGreaterThan(2010);
  });

  test("return random number less than 2010", function () {
    let lessThanMax = getRandomApiNum({ max: 2010, type: "math" });
    expect(lessThanMax).toBeLessThan(2010);
  });

  test("return random number when min and max are NaN", function () {
    let invalidInputNum = getRandomApiNum({ min: "a", max: "b", type: "year" });
    expect(typeof invalidInputNum).toBe("number");
  });

  test("return random number when min and max are undefined", function () {
    let noMinMax = getRandomApiNum({ type: "year" });
    expect(typeof noMinMax).toBe("number");
  });
});

describe("getRandomApiNum() with type 'year'", () => {
  test("return same number as min and max", function () {
    let sameAsMinMax = getRandomApiNum({ min: 2010, max: 2010, type: "year" });
    expect(sameAsMinMax).toEqual(2010);
  });

  test("return random number greater than 2010", function () {
    let greaterThanMin = getRandomApiNum({ min: 2010, type: "year" });
    expect(greaterThanMin).toBeGreaterThan(2010);
  });

  test("return random number less than 2010", function () {
    let lessThanMax = getRandomApiNum({ max: 2010, type: "year" });
    expect(lessThanMax).toBeLessThan(2010);
  });

  test("return random number when min and max are NaN", function () {
    let invalidInputNum = getRandomApiNum({ min: "a", max: "b", type: "year" });
    expect(typeof invalidInputNum).toBe("number");
  });

  test("return random number when min and max are undefined", function () {
    let noMinMax = getRandomApiNum({ type: "year" });
    expect(typeof noMinMax).toBe("number");
  });
});

describe("getSentence() for type 'year'", () => {
  test("When wantFragment is true, returns partial text only", function () {
    const sentence = getSentence({
      wantFragment: true,
      number: 1000,
      type: "year",
      data: {
        text: "Sweyn I establishes Danish control over part of Norway",
      },
    });
    expect(sentence).toBe(
      "Sweyn I establishes Danish control over part of Norway"
    );
  });

  test("When wantFragment is undefined, returns full sentence", function () {
    const sentence = getSentence({
      number: 1000,
      type: "year",
      data: {
        text: "Sweyn I establishes Danish control over part of Norway",
      },
    });
    expect(sentence).toBe(
      "1000 is the year that Sweyn I establishes Danish control over part of Norway."
    );
  });

  test("When data has key of date, returns full sentence with date in the end", function () {
    const sentence = getSentence({
      number: 1000,
      type: "year",
      data: {
        date: "December 25",
        text:
          "Stephen I becomes King of Hungary, which is established as a Christian kingdom",
      },
    });
    expect(sentence).toBe(
      "1000 is the year that Stephen I becomes King of Hungary, which is established as a Christian kingdom on December 25th."
    );
  });

  test("Return sentence when year is invalid", function () {
    const sentence = getSentence({
      type: "year",
      number: 10000000000,
      data: {
        text: "nothing remarkable happened",
      },
    });
    expect(sentence).toBe(
      "10000000000 is the year that nothing remarkable happened."
    );
  });
});

describe("getSentence() for types: trivia and math", () => {
  // trivia and math share the same prefix
  test("When wantFragment is true, returns partial text only", function () {
    const sentence = getSentence({
      wantFragment: true,
      number: 88,
      type: "trivia",
      data: {
        text: "the number of keys on a piano (36 black and 52 white)",
      },
    });
    expect(sentence).toBe(
      "the number of keys on a piano (36 black and 52 white)"
    );
  });

  test("When wantFragment is undefined, returns full sentence", function () {
    const sentence = getSentence({
      number: 88,
      type: "trivia",
      data: {
        text: "the number of keys on a piano (36 black and 52 white)",
      },
    });
    expect(sentence).toBe(
      "88 is the number of keys on a piano (36 black and 52 white)."
    );
  });

  test("When trivia number is invalid, returns sentence", function () {
    const sentence = getSentence({
      number: 88888,
      type: "trivia",
      data: {
        text: "an unremarkable number",
      },
    });
    expect(sentence).toBe("88888 is an unremarkable number.");
  });
});

describe("getSentence() for type 'date' ", function () {
  test("When wantFragment is undefined, returns full sentence", function () {
    const sentence = getSentence({
      number: 1,
      type: "date",
      data: {
        text: "that Victoria is crowned princess of Sweden",
        year: 1980,
      },
    });
    expect(sentence).toBe(
      "January 1st is the day in 1980 that that Victoria is crowned princess of Sweden."
    );
  });
});

describe("getDefaultMsg() for all 4 types", function () {
  test("random default msg for type:'year'", function () {
    let yearMsgs = [
      "9999999999 is the year that nothing remarkable happened.",
      "9999999999 is the year that the Earth probably went around the Sun.",
      "9999999999 is the year that nothing interesting came to pass.",
      "9999999999 is the year that we do not know what happened.",
    ];
    const sentence = getDefaultMsg({
      number: 9999999999,
      type: "year",
    });

    yearMsgs = yearMsgs.map(
      (msg) =>
        msg +
        " Have a better fact? Submit one at github.com/rithmschool/numbers_api."
    );
    expect(yearMsgs.includes(sentence)).toEqual(true);
  });

  test("random default msg for type:'math' & type:'trivia'", function () {
    let mathMsgs = [
      "9999999999 is an uninteresting number.",
      "9999999999 is a boring number.",
      "9999999999 is an unremarkable number.",
      "9999999999 is a number for which we're missing a fact.",
    ];
    mathMsgs = mathMsgs.map(
      (msg) =>
        msg +
        " Have a better fact? Submit one at github.com/rithmschool/numbers_api."
    );

    const sentence = getDefaultMsg({
      number: 9999999999,
      type: "math",
    });
    expect(mathMsgs.includes(sentence)).toEqual(true);
  });

  test("default msg for type:'date' with no fact", function () {
    const sentence = getDefaultMsg({
      number: 1,
      type: "date",
    });
    expect(sentence).toBe(
      "January 1st is the day that no newsworthy events happened. Have a better fact? Submit one at github.com/rithmschool/numbers_api."
    );
  });
});

describe("dataPairs", () => {
  // dataPairs returns
  // {"date": [Array], "math": [Array], "trivia": [Array], "year": [Array]}
  // each array contains objects that have this format {'number': 1, string: '1'}

  test("return object with keys 'date', 'math', 'trivia', 'year'", function () {
    expect(Object.keys(dataPairs)).toContain("date", "year", "trivia", "math");
  });

  // each data type contains objects that contains the string and integer version of numbers
  // for example, type "date" contains -infinity, 1 through 366 inclusive, and infinity
  // each data type has a different amount of numbers
  // {'number': 1, string: '1'} is present in every data type

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
    let notPresentKey = filterObj(
      {
        hello: "world",
        not: "this",
      },
      ["whiskey"]
    );
    expect(notPresentKey).toEqual({});
  });
});

describe("apiExtend()", () => {
  test("filters object and extends with new data", function () {
    let extend = apiExtend({ year: 2020, random: "lol" }, { newData: "wow" });
    expect(extend).toEqual({ year: 2020, newData: "wow" });
  });
});

describe("getFact()", () => {
  test("return error object for invalid input type", function () {
    let invalidType = getFact({ number: 1000, type: "sdasd" });
    expect(invalidType).toEqual({
      text: "ERROR: Invalid type.",
      number: 1000,
      type: "sdasd",
    });
  });

  test("return data on random number", function () {
    let randomNumData = getFact({ number: "random", type: "math" });
    expect(randomNumData).toEqual({
      text: expect.any(String),
      number: expect.any(Number),
      found: true,
      type: "math",
    });
  });

  test("return error handling when number not found", function () {
    let notFound = getFact({ number: 1000, type: "math" });
    expect(notFound).toEqual({
      text: expect.any(String),
      number: 1000,
      found: false,
      type: "math",
    });
  });
});

describe("dumpData()", () => {
  beforeEach(() => {
    require("fs");
  });

  test("facts-dump contains correct files", function () {
    dumpData("./facts-dump");
    let factsDump = fs.readdirSync("./facts-dump");
    expect(factsDump).toContain(
      "date.txt",
      "math.txt",
      "trivia.txt",
      "year.txt"
    );
  });
});
