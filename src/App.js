import {
  BrowserRouter,
  Route,
  Switch,
  Router,
} from "react-router-dom";
import { createBrowserHistory } from "history";
import { ROUTERS } from "./router";

import "./styles/index.scss";

const history = createBrowserHistory();

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Router history={history}>
          <div className="app-content">
            <Switch>
              <Route exact path="/" component={ROUTERS.component} />
            </Switch>
          </div>
        </Router>
      </BrowserRouter>
    </div>
  );
}

export default App;
