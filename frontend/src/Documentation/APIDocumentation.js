import './APIDocumentation.css';
import URLStructure from './URLStructure'
import UsageExamples from './UsageExamples'
import QueryParameter from './QueryParameter'
import BatchRequests from './BatchRequests'

function APIDocumentation() {

  return (
    <div id="api-outer"> 
      <h1> API Reference </h1>
      <p>Bring meaning to your metrics and stories to your dates with our API of interesting number facts.</p>
      <URLStructure />
      <UsageExamples />
      <QueryParameter />
      <BatchRequests />
    </div>
  )
}

export default APIDocumentation;