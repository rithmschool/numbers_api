An API to query interesting facts about numbers.

TODO: Change all script src urls to numbersapi.com

## URL Structure
Just hit <code>http://numbersapi.com/<strong>number</strong>/<strong>type</strong></code> to get a plain text response, where

- **`type`** is one of `trivia`, `math`, `date`, or `year`. Defaults to `trivia` if omitted.
- **`number`** is
    - an integer (eg. `0`, `42`, `1337`), or
    - the keyword `random`, or
    - a day of year in the form <code><strong>month</strong>/<strong>day</strong></code> (eg. `2/29`, `1/01`, `04/1`), if **`type`** is `date`

<pre>
http://numbersapi.com/128/math
&rArr; <script src="http://numbersapi.com/128/math?write=1"></script>

http://numbersapi.com/42/trivia
&rArr; <script src="http://numbersapi.com/128/math?write=1"></script>

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

You can make a direct cross-origin request without resorting to JSONP since [CORS](http://en.wikipedia.org/wiki/Cross-Origin_Resource_Sharing) is enabled. See this in action on [JSFiddle](http://jsfiddle.net/divad12/ffHEh/).


<h3 id="jsonp">JSONP</h3>
...is supported with the query field [`callback`](#callback):

    <p>It turns out that 42 is also <span id="number"></span></p>

    <script>
        function showNumber(str) {
            document.getElementById('number').innerText = str;
        }
    </script>
    <script src="http://numbersapi.com/42/math?callback=showNumber"></script>

See this in action on [JSFiddle](http://jsfiddle.net/divad12/4A6Pw/).


<h3 id="html-embedding">HTML Embedding</h3>
TODO: What about just having the 'callback' field with no value?
Include the query field `write` to have the response text wrapped in `document.write()`. This allows you to stick a single `<script>` where the contents should go on your HTML page.

    In the year 2012, <script src="http://numbersapi.com/2012/year?write"></script>.

See this in action on [JSFiddle](http://jsfiddle.net/divad12/vd58j/).


## Options Reference


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
The value of the `default` query field specifies the text to return if there's no corresponding fact for the requested number.

<pre>
http://numbersapi.com/1234567890987654321/year?default=Boring+number+is+boring.
&rArr; Boring number is boring.
</pre>


<h3 id="callback">Callback</h3>
To use [JSONP](http://en.wikipedia.org/wiki/JSONP), pass to the `callback` query the name of the JavaScript function to be invoked. This function will be called with a single argument that is the response text.

<pre>
http://numbersapi.com/42/math?callback=showNumber
&rArr; showNumber("42 is the 5th Catalan number.");
</pre>

See the [JSONP usage example](#jsonp).


<h3 id="write">Write</h3>
Returns the text response wrapped in a call to [`document.write()`](https://developer.mozilla.org/en/document.write). So, `?write` is equivalent to `?callback=document.write`.

<pre>
http://numbersapi.com/42/math?write
&rArr; document.write("42 is the 5th Catalan number.");
</pre>

See the [HTML embedding usage example](#html-embedding).


### Min and Max
Restrict the range of values returned to the inclusive range \[**`min`**, **`max`**\].

<pre>
http://numbersapi.com/random?min=10&max=20
&rArr; <script src="http://numbersapi.com/random?min=10&max=20&write"></script>
</pre>

TODO: sentence structure (data mining)
