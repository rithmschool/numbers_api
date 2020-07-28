const {
  getRandomApiNum,
  getSentence,
  dataPairs,
  filterObj,
  apiExtend,
  getFact,
  dumpData,
} = require("../../models/fact");
const fs = require("fs");

describe("getRandomApiNum() with type 'date'", () => {
  test("return random number greater than or equal to 2010", function () {
    let greaterThanMin = getRandomApiNum("date", { min: 2010 });
    expect(greaterThanMin).toBeGreaterThan(2010);
  });

  test("return random number less than 2010", function () {
    let lessThanMax = getRandomApiNum("date", { max: 2010 });
    expect(lessThanMax).toBeLessThan(2010);
  });

  test("return random number when min and max are NaN", function () {
    let invalidInputNum = getRandomApiNum("date", { min: "a", max: "b" });
    expect(typeof invalidInputNum).toBe("number");
  });

  test("return random number when min and max are undefined", function () {
    let noMinMax = getRandomApiNum("date", {});
    expect(typeof noMinMax).toBe("number");
  });
});

describe("getRandomApiNum() with type 'trivia'", () => {
  test("return random number greater than 2010", function () {
    let greaterThanMin = getRandomApiNum("trivia", { min: 2010 });
    expect(greaterThanMin).toBeGreaterThan(2010);
  });

  test("return random number less than 2010", function () {
    let lessThanMax = getRandomApiNum("trivia", { max: 2010 });
    expect(lessThanMax).toBeLessThan(2010);
  });

  test("return random number when min and max are NaN", function () {
    let invalidInputNum = getRandomApiNum("year", { min: "a", max: "b" });
    expect(typeof invalidInputNum).toBe("number");
  });

  test("return random number when min and max are undefined", function () {
    let noMinMax = getRandomApiNum("year", {});
    expect(typeof noMinMax).toBe("number");
  });
});

describe("getRandomApiNum() with type 'math'", () => {
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
    let invalidInputNum = getRandomApiNum("year", { min: "a", max: "b" });
    expect(typeof invalidInputNum).toBe("number");
  });

  test("return random number when min and max are undefined", function () {
    let noMinMax = getRandomApiNum("year", {});
    expect(typeof noMinMax).toBe("number");
  });
});

describe("getRandomApiNum() with type 'year'", () => {
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
    let invalidInputNum = getRandomApiNum("year", { min: "a", max: "b" });
    expect(typeof invalidInputNum).toBe("number");
  });

  test("return random number when min and max are undefined", function () {
    let noMinMax = getRandomApiNum("year", {});
    expect(typeof noMinMax).toBe("number");
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

describe("getSentence() for types: trivia and math", () => {
  // trivia and math share the same prefix
  const data = {
    text: "the number of keys on a piano (36 black and 52 white)",
  };

  test("When wantFragment is true, returns partial text only", function () {
    let sentence = getSentence({ fragment: true }, 88, "trivia", data);
    expect(sentence).toBe(
      "the number of keys on a piano (36 black and 52 white)"
    );
  });

  test("When wantFragment is undefined, returns full sentence", function () {
    let sentence = getSentence(undefined, 88, "trivia", data);
    expect(sentence).toBe(
      "88 is the number of keys on a piano (36 black and 52 white)."
    );
  });

  test("When trivia number is invalid, returns sentence", function () {
    let sentence = getSentence(undefined, 88888, "trivia", {
      text: "an unremarkable number",
    });
    expect(sentence).toBe("88888 is an unremarkable number.");
  });
});

describe("getSentence() for type 'date' ", () => {
  const data = {
    text: "that Victoria is crowned princess of Sweden",
    year: 1980,
  };

  test("When wantFragment is undefined, returns full sentence", function () {
    let sentence = getSentence(undefined, 1 / 1, "date", data);
    expect(sentence).toBe(
      "January 1st is the day in 1980 that that Victoria is crowned princess of Sweden."
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
    let invalidType = getFact(1000, "sdasd", {});
    expect(invalidType).toEqual({
      text: "ERROR: Invalid type.",
      number: 1000,
      type: "sdasd",
    });
  });

  test("return data on random number", function () {
    let randomNumData = getFact("random", "math", {});
    expect(randomNumData).toEqual({
      text: expect.any(String),
      number: expect.any(Number),
      found: true,
      type: "math",
    });
  });

  test("return error handling when number not found", function () {
    let notFound = getFact(1000, "math", {});
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
    expect(factsDump).toEqual([
      ".gitignore",
      "date.txt",
      "math.txt",
      "trivia.txt",
      "year.txt",
    ]);
  });
});
