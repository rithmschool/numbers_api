## GraphQL Introduction

### Getting Started

To get the GraphQL server started, type `npm run start-graphql` in the terminal and go to localhost:3001/graphql.

To get the endpoints that are currently available, click on the "Docs" tab on the right hand side of the screen to open the documentation explorer. The documentation explorer allows you to click through the different available queries, display the type associated with that query, and the schema for each of the types.

<img src="documentation_images/doc explorer.gif" width="300px"/>

You can open a new tab inside the interface to make another query without losing your current one.

<img src="documentation_images/newtab.gif" width="300px" />

---

### Querying

Unlike RESTful APIs, GraphQL allows the client to determine what information the server returns. For example, our NumberType _can_ pass back facts about the number as types: trivia, date, math, or year. But if the user only wants the math fact, they can specify only the math fact should be passed back.

Example queries (user puts in number in place of int):

Get all facts about a specific number

```
query {
  number(number: int) {
    trivia
    date
    math
    year
  }
}
```

Only get the math facts about a specific number

```
query {
  number(number: int) {
    math
  }
}
```

---

### Expected Output

The expected output is a JSON object, in which each fact type's value is an array of strings with each fact as an element if there is a valid fact for that type and number.

```
query {
  number(number: 255) {
    trivia
    math
  }
}
```

The expected output for this is:

```
{
  "data": {
    "number": {
      "trivia": [
        "the largest representable integer in an unsigned byte",
        "the largest values that can be assigned to elements in the 24-bit RGB color model, since each color channel is allotted eight bits"
      ],
      "math": [
        "a repdigit in base 2 (11111111) in base 4 (3333), and in base 16 (FF)"
      ]
    }
  }
}
```

If there is not a valid fact for a number and a type, there will be a semi-randomized default message and a suggestion to submit your own fact to Rithm. This is also returned as an array.

```
query {
  number(number: -99) {
    year
  }
}
```

The expect output for this is:

```
{
  "data": {
    "number": {
      "year": [
        "99 BC is the year that nothing remarkable happened. Have a better fact? Submit one at github.com/rithmschool/numbers_api."
      ]
    }
  }
}
```

---

### Dates

A number for a date is based on what day of the year that day falls on within a leap year. If a number is larger than 366, the years increment as if moving to the next year.

| Number | Date Conversion |
| ------ | --------------- |
| 1      | January 1       |
| 31     | January 31      |
| 60     | February 29     |
| 366    | December 31     |
| 367    | January 1       |
| 425    | February 28     |
| 426    | March 1         |
| 1521   | February 29     |

For zero and negative numbers, the date associated with the number assumes that 1 is January 1st of a leap year and moves backwards.

| Number | Date Conversion |
| ------ | --------------- |
| 0      | December 31     |
| -1     | December 30     |
| -364   | January 1       |
| -365   | December 31     |
| -1401  | February 29     |
