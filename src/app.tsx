import { Helmet } from 'react-helmet';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import Editor from './editor';

const App = () => {
  return (
      <Router>
        <Helmet
          defaultTitle="Quiz Site"
          titleTemplate="%s | Quiz Site"
        >
            <meta charSet="utf-8" />
            <title>Home</title>
        </Helmet>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/editor">Editor</Link>
              </li>
            </ul>
          </nav>

          <Switch>
            <Route path="/editor">
              <Editor />
            </Route>
            <Route path="/">
              <span>This is the app.</span>
            </Route>
          </Switch>
        </div>
      </Router>
  );
};

export default App;
