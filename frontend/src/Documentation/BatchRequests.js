function BatchRequests() {
  return (
    <div id="last-div-documentation">
      <h2 className="doc-section-title" id="batch-requests">Batch Requests</h2>
      <p>To get facts about multiple numbers in one request, specify ranges for <code>number</code> in <code><a href="#">http://numbersapi.com/api/</a>number/type.</code></p>
      <p>A number range (inclusive) is specified as <code>min..max</code>. Separate multiple ranges and individual numbers with <code>,</code> (a comma).</p>
      <p>The response format will always be a JSON map from numbers to facts, of at most 100 numbers. The query parameter <code>json</code> may still be used to specify whether individual facts will be returned as string literals or JSON objects.</p>
      <div className="doc-examples">
        <pre>
          <code>
          {`http://numbersapi.com/api/1..3,10
⇒ {
    "1": "1 is the number of dimensions of a line.",
    "2": "2 is the number of polynucleotide strands in a DNA double helix.",
    "3": "3 is the number of sets needed to be won to win the whole match in volleyball.",
    "10": "10 is the highest score possible in Olympics gymnastics competitions."
}`}
          </code>
        </pre>
      </div>
    </div>
  )
}

export default BatchRequests