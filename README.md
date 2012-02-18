An API to query interesting facts about numbers.

## Usage

### Plaintext

Just hit <code>http://numbersapi.com/<strong>number</strong>/<strong>type</strong></code> to get a plain text response, where

- **`type`** is one of `trivia`, `math`, `date`, or `year`
- **`number`** is
    - an integer (eg. `0`, `42`, `1337`)
    - the keyword `random`
    - a day of year in the form <code><strong>month</strong>/<strong>day</strong></code> (eg. `2/29`, `1/01`, `04/1`), if **`type`** is `date`

<pre>
http://numbersapi.com/128/math
&rArr; <script src="/128/math?write=1"></script>

http://numbersapi.com/42/trivia
&rArr; <script src="/128/math?write=1"></script>

http://numbersapi.com/2/29/date
&rArr; <script src="/2/29/date?write=1"></script>

http://numbersapi.com/random/year
&rArr; <script src="/random/year?write=1"></script>
</pre>

### jQuery
HTML:

    We now have more users than <div id="number"></div>!

jQuery:

    $.get('http://numbersapi.com/1337/trivia?notfound=floor', function(data) {
        $('#number').text(data);
    });

since [CORS](http://en.wikipedia.org/wiki/Cross-Origin_Resource_Sharing) is enabled.

### JSONP
...is supported with the query field `callback`:

    <p>
        It turns out that 42 is also <span id="number"></span>.
    </p>

    <script>
        function showNumber(str) {
            document.getElementById('number').innerText = str;
        }
    </script>
    <script src="http://numbersapi.com/42/math?callback=showNumber"></script>

### HTML Embedding
TODO: What about just having the 'callback' field with no value?
Include the query field `write` to have the response text wrapped in `document.write()`. This allows you to stick a single `<script>` where the contents should go on your HTML page.

    <p>
        In the year 2012, <script src="http://numbersapi.com/2012/year?write"></script>.
    </p>

## Options Reference

### Default
The value of the `default` query field specifies the text to return if there's no corresponding fact for the requested number.

<pre>
http://numbersapi.com/1234567890987654321/year
&rArr; <script src="/1234567890987654321/year?write=1"></script>
</pre>

- notfound
- default
- max & min
- callback
- sentence structure
