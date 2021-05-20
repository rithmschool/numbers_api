import './App.css';
import NumberContext from "./NumberContext";
import { useEffect, useState } from 'react';
import Api from './Api'
import Routes from './Routes'
import { BrowserRouter } from 'react-router-dom';

/** 
 * App
 * 
 * Props:
 * - None
 * 
 * State: 
 * - path - string of pathname after '/fact/' or '/api/'
 * - numFact - object of the API response. 
 *      {
 *        found: boolean
 *        number: num
 *        text: "fact about num"
 *        type: category i.e- (trivia, math, random, date)
 *      }
 * Context:
 * - json - boolean of whether or not the url is requesting the number fact return
 *    as a json object or text
 * - numFact
 * - path + setPath
 * 
 * (App) -> Routes -> Home
 *                 -> APIResponse
 */


// url index for whether user wants to interact with /api (5) or /fact(6)
const pathStartIndex = window.location.pathname.startsWith('/api') ? 5 : 6

function App() {
  const parsedURL = window.location.pathname.substr(pathStartIndex) + window.location.search;
  const [numFact, setNumFact] = useState({text: "", number: 42, type: "trivia"});
  const [path, setPath] = useState(parsedURL || 42);
  const json = window.location.search.endsWith('?json') ? true : false;

  // on initial render set numFact
  useEffect(() => {
    updatePathOrNumFact(path, true);
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // set state for path or numFact  
  async function updatePathOrNumFact(val, action=false) {
    if(path !== val) {
      setPath(val);
    }
    if(action || !numFact) {
      let resp = await Api.getNumberFact(val);
      setNumFact(() => resp)
    }
  }

  return (
    <BrowserRouter>
      <NumberContext.Provider value={{ json, path, numFact, setPath, updatePathOrNumFact }}>
        <div className="App">
          <Routes />
        </div>
      </NumberContext.Provider>
    </BrowserRouter>
  );
}
export default App;