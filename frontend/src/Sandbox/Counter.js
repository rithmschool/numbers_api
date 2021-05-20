import './Counter.css'
import NumberContext from "../NumberContext"
import { useContext } from 'react';

/**
 * Display the current number in context
 *
 * Props: 
 * - None
 * Context:
 * - numFact 
 * - updatePathOrNumFact
 *
 * SandboxCard -> (Counter)
 */
const leapYear = 2020; // any year that has 366 days is suitable

function Counter() {
  const { numFact, updatePathOrNumFact } = useContext(NumberContext)
  const category = numFact.type;

  function handleChange(evt) {
    const { value } = evt.target;  
    if(numFact.type === 'date') {
      let date = dateFromDay(leapYear, value);
      updatePathOrNumFact(`${date}/${category}`, true)
    }
    else  {
      updatePathOrNumFact(`${value}/${category}`, true)
    }
  }
  // given a DD/YYYY date, resolve what day of the year 
  function dateFromDay(year, day){
    const date = new Date(year, 0); // initialize a date in `year-01-01`
    const finalDate = new Date(date.setDate(day)); // add the number of days
    const dayOfMonth = finalDate.getMonth() + 1;
    const month = finalDate.getDate();
    return `${dayOfMonth}/${month}`
  }

  return (
    <div className="counter-container" >
      <input 
        className="counter" 
        type="number" 
        min="-9999" 
        max="9999" 
        value={numFact.number}
        onChange={handleChange} 
      />
    </div>
  )
}

export default Counter;