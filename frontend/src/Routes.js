import {Switch, Route, Redirect} from "react-router-dom"
import Home from "./Home"
import APIResponse from "./APIResponse"

/*;
Routes to either website OR api response

Props: 
- None
State:
- None

(Route) -> Home
        -> APIResponse
*/

function Routes() {
  return (
    <div>
      <Switch>
      <Route path={`/fact/:parameter`}><Home/></Route>
      <Route path={`/api/:parameter`}><APIResponse/></Route>
      {/* <Redirect to='/fact/42'/> */}
      </Switch>
    </div>
  )

}

export default Routes;