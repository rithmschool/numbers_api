//import;

function URLStructure() {
  return (
    <div>
      <h2 className="doc-section-title">URL Structure</h2>
      <p> Just hit&nbsp;
        <code>
          <a href="#"> 
              http://numbersapi.com/
          </a>
          api/
          <strong>number</strong>
          /
          <strong>type</strong>
        </code>
        to get a plain text response, where:
      </p>
      <ul>
        <li><strong><code>type</code></strong> is one of <code>trivia</code>, <code>math</code>, <code>date</code>, or <code>year</code>. Defaults to <code>trivia</code> if omitted.</li>
        <li><strong><code>number</code></strong> is
          <ul>
            <li>an integer, or</li>
            <li>the keyword <code>random</code>, for which we will try to return a random available fact, or</li>
            <li>a day of year in the form <code><strong>month</strong>/<strong>day</strong></code> (eg. <code>2/29</code>, <code>1/09</code>, <code>04/1</code>), if <strong><code>type</code></strong> is <code>date</code></li>
            <li><a href="#batch-request">ranges of numbers</a></li>
          </ul>
        </li>
      </ul>
      <div className="doc-examples">
        <span >http://numbersapi.com/api/42
          ⇒ 42 is the result given by Google and Bing for the query "the answer to life the universe and everything".

          http://numbersapi.com/api/2/29/date
          ⇒ February 29 is the day in 1504 that Christopher Columbus uses his knowledge of a lunar eclipse to convince Native Americans to provide him with supplies.

          http://numbersapi.com/api/random/year
          ⇒ 2013 is the year that China will attempt its first unmanned Moon landing.
        </span>
      </div>
    </div>
  )
}

export default URLStructure;