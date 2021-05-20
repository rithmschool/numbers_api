import { Switch, Route } from "react-router-dom"
import Home from "./Home"
import APIResponse from "./APIResponse"
import NotFound from "./NotFound"

/*;
* Routes to either website OR api response
*
* Props: 
* - None
* State:
* - None
* 
* (Route) -> Home
*         -> APIResponse
*/

function Routes() {
  return (
    <div>
      <Switch>
        <Route path={`/fact/:parameter`}><Home/></Route>
        <Route path={`/api/:parameter`}><APIResponse/></Route>
        <Route exact path={`/`}><Home/></Route>
        <Route><NotFound /></Route>
      </Switch>
    </div>
  )

}

export default Routes;