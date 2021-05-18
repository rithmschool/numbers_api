//import;

function UsageExamples() {
  return (
    <div>
      <h2 className="doc-section-title" id="usage-examples">Usage Examples</h2>
      <h3 id="jquery">jQuery</h3>
      <div className="Jquery-examples">
        <p>HTML:</p>
        <div className="doc-examples">
          <span>
            We now have more users than &lt;span id="number"&gt;&lt;/span&gt;!
          </span>
        </div>
        <p>JavaScript:</p>
        <div className="doc-examples">
          <span>
            {`$.get('http://numbersapi.com/1337/trivia?notfound=floor&fragment', function(data) {
            $('#number').text(data);
            });`}
          </span>
        </div>
        <p>Direct cross-origin requests like this are possible on browsers that support
          <a href="http://en.wikipedia.org/wiki/Cross-Origin_Resource_Sharing"> CORS
          </a>. Live demo on 
          <a href="http://jsfiddle.net/divad12/ffHEh/"> JSFiddle</a>.
        </p>
      </div>
      <div className="Jsonp-examples">
        <h3 id="jsonp">JSONP</h3>
        <p>...is supported with the query field <a href="#callback"><code>callback</code></a>:</p>
        <div className="doc-examples">
          <pre>
            <code>{`
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
            `}
            </code>
          </pre>
        </div>
        <p>
          Live demo on <a href="http://jsfiddle.net/divad12/4A6Pw/">JSFiddle</a>.
        </p>
      <h3 id="single-script-tag">HTML Embed</h3>
      <p>Add <code>write</code> to your query string to have the response text wrapped in <code>document.write()</code>. Now you can stick just a single <code>&lt;script&gt;</code> directly where the fact should go.</p>
      <div className="doc-examples">
        <pre>
          <code>{`Did you know 2012 is the year that <script src="http://numbersapi.com/2012/year?write&fragment">
</script>?`}
          </code>
        </pre>
      </div>
      <p>
        Note that this may <a href='https://developer.yahoo.com/performance/rules.html#js_bottom'>degrade page load speed</a>. Live demo on <a href="http://jsfiddle.net/vd58j/">JSFiddle</a>.
      </p>
      </div>
    </div>
  )
}

export default UsageExamples;