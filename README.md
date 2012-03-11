Bring meaning to your metrics and stories to your dates with our API of interesting number facts.

## URL Structure
Just hit <code>http://numbersapi.com/<strong>number</strong>/<strong>type</strong></code> to get a plain text response, where

- **`type`** is one of `trivia`, `math`, `date`, or `year`. Defaults to `trivia` if omitted.
- **`number`** is
    - an integer, or
    - the keyword `random`, for which we will try to return a random available fact, or
    - a day of year in the form <code><strong>month</strong>/<strong>day</strong></code> (eg. `2/29`, `1/09`, `04/1`), if **`type`** is `date`
    - <a href="#batching">ranges of numbers</a>

<pre>
http://numbersapi.com/42
&rArr; The result given by Google and Bing for the query "the answer to life the universe and everything".

http://numbersapi.com/2/29/date
&rArr; February 29 is the day in 1504 that Christopher Columbus uses his knowledge of a lunar eclipse to convince Native Americans to provide him with supplies.

http://numbersapi.com/random/year
&rArr; 2013 is the year that China will attempt its first unmanned Moon landing.
</pre>


## Usage Examples

### jQuery
HTML:

    We now have more users than <span id="number"></span>!

JavaScript:

    $.get('http://numbersapi.com/1337/trivia?notfound=floor&fragment', function(data) {
        $('#number').text(data);
    });

Direct cross-origin requests like this are possible on browsers that support [CORS](http://en.wikipedia.org/wiki/Cross-Origin_Resource_Sharing). Live demo on [JSFiddle](http://jsfiddle.net/divad12/ffHEh/).


<h3 id="jsonp">JSONP</h3>
...is supported with the query field [`callback`](#callback):

    <span id="number-fact"></span>

    <script>
        function showNumber(str) {
            document.getElementById('number-fact').innerText = str;
        }

        (function() {
            var scriptTag = document.createElement('script');
            scriptTag.async = true;
            scriptTag.src = "http://numbersapi.com/42/math?callback=showNumber";
            document.body.appendChild(scriptTag);
        })();
    </script>

Live demo on [JSFiddle](http://jsfiddle.net/divad12/4A6Pw/).


<h3 id="single-script-tag">HTML Embed</h3>
Add `write` to your query string to have the response text wrapped in `document.write()`. Now you can stick just a single `<script>` directly where the fact should go.

    Did you know 2012 is the year that <script src="http://numbersapi.com/2012/year?write&fragment"></script>?

Note that this may <a href="http://developer.yahoo.com/performance/rules.html#js_bottom">degrade page load speed</a>. Live demo on [JSFiddle](http://jsfiddle.net/divad12/vd58j/).


## Query Parameter Options

<h3 id="fragment">Fragment</h3>
Return the fact as a sentence fragment that can be easily included as part of a larger sentence. This means that the first word is lowercase and ending punctuation is omitted. For trivia and math, a noun phrase is returned that can be used in a sentence like "We now have more users than [fact as fragment]!".

<pre>
http://numbersapi.com/23/trivia?fragment
&rArr; the number of times Julius Caesar was stabbed

http://numbersapi.com/1969/year?fragment
&rArr; an estimated 500 million people worldwide watch Neil Armstrong take his historic first steps on the Moon
</pre>


### Notfound
The `notfound` field tells us what to do if the number is not found. You can give us

- `default` to return one of our pre-written missing messages, or a message you supply with the [`default`](#default) query field. This is the default behaviour.
    <pre>http://numbersapi.com/314159265358979
&rArr; 314159265358979 is a boring number.</pre>
- `floor` to round down to the largest number that does have an associated fact, and return that fact.
    <pre>http://numbersapi.com/35353?notfound=floor
&rArr; 35000 is the number of genes in a human being.</pre>
- `ceil`, which is like `floor` but rounds up to the smallest number that has an associated fact.
    <pre>http://numbersapi.com/-12344/year?notfound=ceil
&rArr; 98 BC is the year that the Senate passes the Lex Caecilia Didia which bans omnibus bills.</pre>

Combine with the [fragment](#fragment) option to produce interesting facts about, for example, [the number of page shares](#visitors).


<h3 id="default">Default</h3>
The value of the `default` query field tells us what to return if we don't have a fact for the requested number.

<pre>
http://numbersapi.com/1234567890987654321/year?default=Boring+number+is+boring.
&rArr; Boring number is boring.
</pre>


<h3 id="callback">Callback</h3>
To use [JSONP](http://en.wikipedia.org/wiki/JSONP), pass to the `callback` query the name of the JavaScript function to be invoked. The response will be that function called on the fact text as a string literal.

<pre>
http://numbersapi.com/42/math?callback=showNumber
&rArr; showNumber("42 is the 5th Catalan number.");
</pre>

See the [JSONP usage example](#jsonp).


<h3 id="write">Write</h3>
Returns the text response wrapped in a call to [`document.write()`](https://developer.mozilla.org/en/document.write). Note that using this query parameter is equivalent to and just a shorthand of `?callback=document.write`.

<pre>
http://numbersapi.com/42/math?write
&rArr; document.write("42 is the 5th Catalan number.");
</pre>

See the [HTML embed tag usage example](#single-script-tag).


### Min and Max
Restrict the range of values returned to the inclusive range \[**`min`**, **`max`**\] when `random` is given as the number.

<pre>
http://numbersapi.com/random?min=10&max=20
13 is the number of provinces and territories in Canada.
</pre>

### Json
Include the query parameter `json` or set the HTTP header `Content-Type` to `application/json` to return the fact and associated meta-data as a JSON object, with the properties:

- `text`: A string of the fact text itself.
- `found`: Boolean of whether there was a fact for the requested number.
- `number`: The floating-point number that the fact pertains to. This may be useful for, eg. a `/random` request or `notfound=floor`. For a date fact, this is the 1-indexed day of a leap year (eg. 61 would be March 1st).
- `type`: String of the category of the returned fact.
- `date` (sometimes): A day of year associated with some year facts, as a string.
- `year` (sometimes): A year associated with some date facts, as a string.

<pre>
http://numbersapi.com/random/year?json
&rArr; {
    "text": "2012 is the year that the century's second and last solar transit of Venus occurs on June 6.",
    "found": true,
    "number": 2012,
    "type": "year",
    "date": "June 6"
}
</pre>

<h3 id="batching">Batching</h3>
Earlier, it was mentioned that the general request url format is <code>http://numbersapi.com/<strong>number</strong>/<strong>type</strong></code>. In reality, `number` is more complicated than this, and can be specify multiple numbers ranges to allow making batch requests for multiple numbers. A number range is specified as `min..max`, where `min` and `max` are separated by `..` (two dots). Each number between `min` and `max` inclusive will be returned. A mixture of individual numbers and number ranges can be requested at once separating them with a `,` (a comma).

When a batch request is made, the response format will always be a JSON object containing number to fact pairs.At most, 100 numbers will be returned. The returned The query parameter `json` may still be used to specify whether the individual facts will be returned as string literals or JSON objects.

<pre>
http://numbersapi.com/1:3,10
&rArr; {
    "1": "1 is the number of dimensions of a line.",
    "2": "2 is the number of polynucleotide strands in a DNA double helix.",
    "3": "3 is the number of sets needed to be won to win the whole match in volleyball.",
    "10": "10 is the highest score possible in Olympics gymnastics competitions."
}
</pre>


<!--TODO: make sentence structure work out (data mining) -->
