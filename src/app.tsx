import * as React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import Editor from './editor';
import Login from './login';
import LogoutButton from './login/LogoutButton';
// import PageViewLogger from './util/pageViewLogger';

const App = () => {
  return (
      <Router>
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
            <LogoutButton />
          </nav>

          <br />
          <br />

          <Switch>
            <Route path="/editor">
              <Editor />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/">
              <span>This is the app.</span>
            </Route>
          </Switch>
        </div>

        {/* Uncomment after upgrading Firebase dependency. QUIZ-13 */}
        {/* <PageViewLogger /> */}
      </Router>
  );
};

export default App;
