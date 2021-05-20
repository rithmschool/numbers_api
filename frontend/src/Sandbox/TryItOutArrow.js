import './TryItOutArrow.css'

/**
* Image of arrow + 'try it out'
*
* Props: 
* - None
* State:
* - None
*
*  SanboxContainer -> (TryItOutArrow)
*/

function TryItOutArrow() {
  return (
    <div>
      <div id="sandbox-text" className="pastel_crayon">Try it out!</div>
      <div className="arrow"></div>
    </div>
  )
}

export default TryItOutArrow;