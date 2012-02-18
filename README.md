An API to query interesting facts about numbers.

## Usage

### Plaintext

Just hit `http://numbersapi.com/`**`number`**`/`**`type`** to get a plain text response, where

- **`type`** is one of `trivia`, `math`, `date`, or `year`
- **`number`** is
    - an integer (eg. `0`, `42`, `1337`), except if
    - the keyword `random`
    - **`type`** is `date`, then **`number`** specifies a day of year in the form **`month`**/**`day`** (eg. `2/29`, `1/01`, `04/1`)

TODO: formatting for `<code>` and `<pre>` blocks.

<pre>
    http://numbersapi.com/128/math
    <strong>==&gt;</strong> <script src="/128/math?write=1"></script>

    http://numbersapi.com/42/trivia
    <strong>==&gt;</strong> <script src="/128/math?write=1"></script>

    http://numbersapi.com/2/29/date
    <strong>==&gt;</strong> <script src="/2/29/date?write=1"></script>

    http://numbersapi.com/random/year
    <strong>==&gt;</strong> <script src="/random/year?write=1"></script>
</pre>

TODO: collapsible examples in php, node.js, python, ruby

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

- notfound
- default
- max & min
- callback
