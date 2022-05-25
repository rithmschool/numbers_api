## HOW WE GOT THE DATA

We used wikidata to gather the data for our queries.
Here is an example of the tourist attraction [query](https://query.wikidata.org/#SELECT%20%3Flocation%20%3Fcordinates%20%3Fvisitors%20%3FlocationLabel%0A%0AWHERE%20%7B%0A%0A%20%20%3Flocation%20wdt%3AP31%20wd%3AQ570116%20.%20%23tourist%20attractions%0A%20%20%3Flocation%20wdt%3AP625%20%3Fcordinates%20.%0A%20%20OPTIONAL%20%7B%0A%20%20%20%20%3Flocation%20wdt%3AP1174%20%3Fvisitors%20.%20%0A%20%20%7D%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%0A%20%20%20%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22%0A%20%20%7D%0A%7D%0A%0AORDER%20BY%20DESC%28%3FlocationLabel%29%0A). We downloaded the JSON and pasted the data in `attractionsRawData.js`.

We then sanitized the data in `parseData.js`, where it returns:
```
[
    {name: "White House", visitors: 10, coordinates: "Point(12, 34)"},
    {name: "jeff's museum", visitors: 1, coordinates: "Point(12,35"},
    ...
]

```

## How to get started

To make the graphql queries, run the script `npm run start-wiki-gql`.
The server will run on `localhost:9001/graphql`.

## HOW TO MAKE WIKIDATA GRAPHQL QUERIES

### getAttractions Query:

```
query {
    getAttractions(keyword: "castle") {
        name
        visitors
        coordinates
    }
}
```
### getAttractions Result:
```
"data": {
    "getAttractions": [
    {
        "name": "Örebro Castle",
        "visitors": 0,
        "coordinates": "Point(15.215277777 59.273888888)"
    },
    {
        "name": "Örbyhus Castle",
        "visitors": 0,
        "coordinates": "Point(17.7092 60.2)"
    },
    {
        "name": "Årsta Castle",
        "visitors": 0,
        "coordinates": "Point(18.19388889 59.1075)"
    },
    ...
    ]
}
```

### getMuseums Query:
```
query {
    getMuseums(keyword: "art") {
        name
        visitors
        coordinates
    }
}
```
### getMuseums Result:
```
"data": {
    "getMuseums": [
        {
            "name": "“Ў” Gallery of Contemporary Art",
            "visitors": 0,
            "coordinates": "Point(27.57555556 53.91055556)"
        },
        {
            "name": "Ōtsuka Museum of Art",
            "visitors": 0,
            "coordinates": "Point(134.638 34.2324)"
        },
        {
            "name": "Ōta Memorial Museum of Art",
            "visitors": 0,
            "coordinates": "Point(139.705 35.6694)"
        },
        ...
    ]
}
```

### getVisitors Query:

getVisitors takes arguments `type`, `operator`, `count`. 

`type`'s value is a string of either `"attractions"` or `"museums"`

`operator`'s value is `"<"`, `"<="`, `">"`, `">="`, `"==="`

--operator can also use `"+"` or `"-"` and it will return all the data. We can also use `"=="` and it will work similar to `"==="`.

`count`'s value is an int.


```
query {
    getVisitors(type: "attractions", operator:">=", count:10000) {
        name
        visitors
        coordinates
    }
}
```

### getVisitors Result:

```
"data": {
    "getVisitors": [
        {
            "name": "Yosemite National Park",
            "visitors": 5028868,
            "coordinates": "Point(-119.5375 37.7425)"
        },
        {
            "name": "Yellowstone National Park",
            "visitors": 4257177,
            "coordinates": "Point(-110.5471962 44.5964446)"
        },
        {
            "name": "White House",
            "visitors": 1090446,
            "coordinates": "Point(-77.03655 38.897669444)"
        },
    ]
}
```




