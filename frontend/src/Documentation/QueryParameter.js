function QueryParameter() {
  return (
    <div>
      <h2 className="doc-section-title" id="usage-examples">Query Parameter Options</h2>
      <h3 id="fragment">Fragment</h3>
      <div className="param-examples">
        <p>Return the fact as a sentence fragment that can be easily included as 
          part of a larger sentence. This means that the first word is lowercase 
          and ending punctuation is omitted. For trivia and math, a noun phrase is 
          returned that can be used in a sentence like "We now have more users than 
          [fact as fragment]!".:
        </p>
        <div className="doc-examples">
          <pre>
            <code>{`http://numbersapi.com/23/trivia?fragment
⇒ the number of times Julius Caesar was stabbed

http://numbersapi.com/1969/year?fragment
⇒ an estimated 500 million people worldwide watch Neil Armstrong take his historic first steps 
on the Moon`}
            </code>
          </pre>
        </div>
      </div>
      <h3 id="not-found">Not Found</h3>
      <p>The <code>notfound</code> field tells us what to do if the number is not found. You can give us</p>
      <ul className="space-between">
        <li><code>default</code> to return one of our pre-written missing messages, or a message you supply with the default query field. This is the default behaviour.</li>
          <div className="doc-examples">
            <pre>
              <code>
              {`http://numbersapi.com/314159265358979
⇒ 314159265358979 is a boring number.`}
              </code>
            </pre>
          </div>
        <li><code>floor</code> to round down to the largest number that does have an associated fact, and return that fact.</li>
          <div className="doc-examples">
              <pre>
                <code>
                {`http://numbersapi.com/35353?notfound=floor
⇒ 35000 is the number of genes in a human being.`}
                </code>
              </pre>
            </div>
        <li><code>ceil</code>, which is like <code>floor</code> but rounds up to the smallest number that has an associated fact.</li>
          <div className="doc-examples">
            <pre>
              <code>
              {`http://numbersapi.com/-12344/year?notfound=ceil
⇒ 98 BC is the year that the Senate passes the Lex Caecilia Didia which bans omnibus bills.`}
              </code>
            </pre>
          </div>
      </ul>
      <p>Combine with the <a href='#fragment'>fragment</a> option to produce interesting facts about, for example, <a href="#visitors">the number of page shares.</a></p>
      <h3 id="default">Default</h3>
      <p>The value of the `default` query field tells us what to return if we don't have a fact for the requested number.</p>
      <div className="doc-examples">
        <pre>
          <code>
          {`http://numbersapi.com/1234567890987654321/year?default=Boring+number+is+boring.
⇒ Boring number is boring.`}
          </code>
        </pre>
      </div>
      <h3 id="callback">Callback</h3>
      <p>To use [JSONP](http://en.wikipedia.org/wiki/JSONP), pass to the `callback` query the name of the JavaScript function to be invoked. The response will be that function called on the fact text as a string literal.</p>
      <div className="doc-examples">
        <pre>
          <code>
          {`http://numbersapi.com/42/math?callback=showNumber
⇒ showNumber("42 is the 5th Catalan number.");`}
          </code>
        </pre>
      </div>
      <p>See the <a href="#jsonp">JSONP usage example</a>.</p> 
      <h3 id="write">Write</h3>
      <p>Returns the text response wrapped in a call to [`document.write()`](https://developer.mozilla.org/en/document.write). Note that using this query parameter is equivalent to and just a shorthand of `?callback=document.write`.</p>
      <div className="doc-examples">
        <pre>
          <code>
          {`http://numbersapi.com/42/math?write
⇒ document.write("42 is the 5th Catalan number.");`}
          </code>
        </pre>
      </div>
      <p>See the <a href="#single-script-tag">HTML embed tag usage example</a>.</p> 
      <h3 id="min-max">Min and Max</h3>
      <p>Restrict the range of values returned to the inclusive range [<code>min</code>, <code>max</code>] when <code>random</code> is given as the number.</p>
      <div className="doc-examples">
        <pre>
          <code>
          {`http://numbersapi.com/random?min=10&max=20
13 is the number of provinces and territories in Canada.`}
          </code>
        </pre>
      </div>
      <h3 id="json">JSON</h3>
      <p>Include the query parameter `json` or set the HTTP header `Content-Type` to `application/json` to return the fact and associated meta-data as a JSON object, with the properties:</p>
      <ul>
        <li><code>text</code>: A string of the fact text itself.</li>
        <li><code>found</code>: Boolean of whether there was a fact for the requested number.</li>
        <li><code>number</code>: The floating-point number that the fact pertains to. This may be useful for, eg. a <code>/random</code> request or <code>notfound=floor</code>. For a date fact, this is the 1-indexed day of a leap year (eg. 61 would be March 1st).</li>
        <li><code>type</code>: String of the category of the returned fact.</li>
        <li><code>date</code> (sometimes): A day of year associated with some year facts, as a string.</li>
        <li><code>year</code> (sometimes): A year associated with some date facts, as a string.</li>
      </ul>
      <div className="doc-examples">
        <pre>
          <code>
          {`http://numbersapi.com/random/year?json
⇒ {
    "text": "2012 is the year that the century's second and last solar transit of Venus occurs 
on June 6.",
    "found": true,
    "number": 2012,
    "type": "year",
    "date": "June 6"
}`}
          </code>
        </pre>
      </div>
    </div>
  )
}

export default QueryParameter