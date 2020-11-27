import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { preloadFirestore } from 'reactfire';

import { BoardsListPage, EditorPage } from './editor';
import GameConfiguratorPage, { GamePage } from './game';
import Login from './login';
import NavBar from './navbar';
import Page from './util/Page';
// import PageViewLogger from './util/pageViewLogger';

const App = () => {
  preloadFirestore({
    setup: (firestore) =>
      firestore().enablePersistence({ synchronizeTabs: true }),
  });

  return (
    <Router>
      <div>
        <NavBar />
        <Switch>
          <Route path="/editor/board/:boardId">
            <EditorPage />
          </Route>
          <Route path="/editor">
            <BoardsListPage />
          </Route>
          <Route path="/game/play/:gameId">
            <GamePage />
          </Route>
          <Route path="/game/new">
            <GameConfiguratorPage />
          </Route>
          <Route path="/game">
            <Redirect to="/game/new" />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Page>
              <span>This is the app.</span>
            </Page>
          </Route>
        </Switch>
      </div>

      {/* Uncomment after upgrading Firebase dependency. QUIZ-13 */}
      {/* <PageViewLogger /> */}
    </Router>
  );
};

export default App;
