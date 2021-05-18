import './CategoryCard.css';
import { useContext } from 'react';
import NumberContext from '../NumberContext';

/**
* Card to represent a number category, with a fact and link to update fact
*
* Props:
* - title - category type (i.e. - math, date, trivia)
* - facts(default): object where each key value is a category and a fact from within that category
* Context:
* - updateCurrNumberString
*
*  CategoryContainer -> (CategoryCard)
*/

const BASE_URL = 'numbersapi.com';
function CategoryCard(props) {
  let type = props.title;
  const { updateCurrNumberString } = useContext(NumberContext)
  let pathname = generateHref()

  //generate an href for the a tag within the card
  function generateHref() {
    if(type === "math") return `/fact/5/${type}`;
    if(type === 'trivia') return `/fact/42`;
    if(type === 'date') return `/fact/5/10/${type}`
  }

  function handleClick(evt) {
    evt.preventDefault()
    // parsed path for numstring
    let string = pathname.substr(6)
    updateCurrNumberString(string, true);
    //updates url to append pathname to end of hostname
    window.history.replaceState({}, document.title, pathname)
  }

  return (
    <div className="example"> 
      <h2>{type}</h2>
      <div className="example-box">
        <a href={pathname} onClick={handleClick}>{`${BASE_URL}${pathname}`}</a>
        <div className="api-result scroll">
          {props.facts[type]}
        </div>
      </div>
    </div>
  )
}

CategoryCard.defaultProps = { facts: {
  trivia: "42 is the number of little squares forming the left side trail of Microsoft's Windows 98 logo.",
  math: "5 is the number of platonic solids.",
  date: "May 10th is the day in 1997 that the Maeslantkering, a storm surge barrier in the Netherlands that is one of the world's largest moving structures, is opened by Queen Beatrix."
  }
}

export default CategoryCard;