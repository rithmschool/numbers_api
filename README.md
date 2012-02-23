Bring meaning to your metrics and stories to your dates with our API of interesting number facts.

## URL Structure
Just hit <code>http://numbersapi.com/<strong>number</strong>/<strong>type</strong></code> to get a plain text response, where

- **`type`** is one of `trivia`, `math`, `date`, or `year`. Defaults to `trivia` if omitted.
- **`number`** is
    - an integer (eg. `0`, `42`, `1337`), or
    - the keyword `random`, for which we will try to return a random available fact, or
    - a day of year in the form <code><strong>month</strong>/<strong>day</strong></code> (eg. `2/29`, `1/01`, `04/1`), if **`type`** is `date`

<pre>
http://numbersapi.com/42
&rArr; The result given by Google and Bing for the query "the answer to life the universe and everything".

http://numbersapi.com/2/29/date
&rArr; <script src="http://numbersapi.com/2/29/date?write=1"></script>

http://numbersapi.com/random/year
&rArr; <script src="http://numbersapi.com/random/year?write=1"></script>
</pre>


## Usage Examples

### jQuery
HTML:

    We now have more users than <span id="number"></span>!

JavaScript:

    $.get('http://numbersapi.com/1337/trivia?notfound=floor', function(data) {
        $('#number').text(data);
    });

Direct cross-origin requests like this are possible on browsers that support [CORS](http://en.wikipedia.org/wiki/Cross-Origin_Resource_Sharing). Live demo on [JSFiddle](http://jsfiddle.net/divad12/ffHEh/).


<h3 id="jsonp">JSONP</h3>
...is supported with the query field [`callback`](#callback):

    It turns out that 42 is also <span id="number"></span>

    <script>
        function showNumber(str) {
            document.getElementById('number').innerText = str;
        }
    </script>
    <script src="http://numbersapi.com/42/math?callback=showNumber"></script>

Live demo on [JSFiddle](http://jsfiddle.net/divad12/4A6Pw/).


<h3 id="single-script-tag">Single Script Tag</h3>
Add `write` to your query string to have the response text wrapped in `document.write()`. Now you can stick just a single `<script>` directly where the fact should go.

    In the year 2012, <script src="http://numbersapi.com/2012/year?write"></script>.

Note that this may <a href="http://developer.yahoo.com/performance/rules.html#js_bottom">degrade page load speed</a>.  Live demo on [JSFiddle](http://jsfiddle.net/divad12/vd58j/).


## Query Parameter Options


### Notfound
The `notfound` field tells us what to do if the number is not found. You can give us

- `default` to return one of our pre-written missing messages, or a message you supply with the [`default`](#default) query field. This is the default behaviour.
    <pre>http://numbersapi.com/314159265358979
&rArr; <script src="http://numbersapi.com/314159265358979?write=1"></script></pre>
- `floor` to round down to the largest number that does have an associated fact, and return that fact.
    <pre>http://numbersapi.com/18923?notfound=floor&standalone
&rArr; <script src="http://numbersapi.com/18923?notfound=floor&write&standalone"></script></pre>
- `ceil`, which is like `floor` but rounds up to the smallest number that has an associated fact.
    <pre>http://numbersapi.com/-12344/year?notfound=ceil&standalone
&rArr; <script src="http://numbersapi.com/-12345/year?notfound=ceil&standalone&write"></script></pre>


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

See the [single script tag usage example](#single-script-tag).


### Min and Max
Restrict the range of values returned to the inclusive range \[**`min`**, **`max`**\].

<pre>
http://numbersapi.com/random?min=10&max=20
&rArr; <script src="http://numbersapi.com/random?min=10&max=20&write"></script>
</pre>

### Json
Include the query parameter `json` to return the fact and associated meta-data as a JSON object, with the properties:

- `text`: A string of the fact text itself.
- `found`: Boolean of whether there was a fact for the requested number.
- `number`: The floating-point number that the fact pertains to. This may be useful for, eg. a `/random` request or `notfound=floor`. For a date fact, this is the 1-indexed day of a leap year (eg. 61 would be March 1st).
- `type`: String of the category of the returned fact.
- `date` (sometimes): A day of year associated with some year facts, as a string.
- `year` (sometimes): A year associated with some date facts, as a string.

<pre>
http://numbersapi.com/random/year?json
&rArr; {
    "text": "The year that the century's second and last solar transit of Venus occurs on June 6.",
    "found": true,
    "number": 2012,
    "type": "year",
    "date": "June 6"
}
</pre>


TODO: make sentence structure work out (data mining)
