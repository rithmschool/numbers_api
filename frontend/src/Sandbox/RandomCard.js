import { useContext } from 'react';
import NumberContext from '../NumberContext';
import './RandomCard.css'

/**
* A card that links to updating random fact for the given category
*
* Props: 
* - None
* Context:
* - updateCurrNumberString
*
* SandboxContainer -> (RandomCard)
*/

function RandomCard() {
  const {updateCurrNumberString} = useContext(NumberContext)
  
  function handleClick(evt) {
    evt.preventDefault()
    let value = evt.target.innerHTML;
    updateCurrNumberString(value, true);
    //updates url to append pathname to end of hostname
    window.history.replaceState({}, document.title, `/fact/${value}`)
  }

  return (
    <div id="search-examples">
      <h3>Random</h3>
      <ul>
        <li><a href="/fact/random/trivia" onClick={handleClick}>random/trivia</a></li>
        <li><a href="/fact/random/year" onClick={handleClick}>random/year</a></li>
        <li><a href="/fact/random/date" onClick={handleClick}>random/date</a></li>
        <li><a href="/fact/random/math" onClick={handleClick}>random/math</a></li>
      </ul>
    </div>
  )
}

export default RandomCard;