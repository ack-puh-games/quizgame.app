import * as React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import { preloadFirestore } from 'reactfire';

import Editor from './editor';
import Login from './login';
import NavBar from './navbar';
// import PageViewLogger from './util/pageViewLogger';

const App = () => {
  preloadFirestore({
    setup: firestore => firestore().enablePersistence(),
  });

  return (
      <Router>
        <div>
          <NavBar />
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
