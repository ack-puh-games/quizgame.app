import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { preloadFirestore } from 'reactfire';

// import PageViewLogger from './util/pageViewLogger';

const LoginPage = React.lazy(() => import('./login'));
const EditorPage = React.lazy(() => import('./editor/Editor'));
const BoardsListPage = React.lazy(() => import('./editor/BoardsList'));
const GameConfiguratorPage = React.lazy(
  () => import('./game/GameConfigurator'),
);
const GamePlayPage = React.lazy(() => import('./game/PlayGame'));
const GameHostPage = React.lazy(() => import('./game/HostGame'));
const NavBar = React.lazy(() => import('./navbar'));
const Page = React.lazy(() => import('./util/Page'));

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
            <GamePlayPage />
          </Route>
          <Route path="/game/host/:gameId">
            <GameHostPage />
          </Route>
          <Route path="/game/new">
            <GameConfiguratorPage />
          </Route>
          <Route path="/game">
            <Redirect to="/game/new" />
          </Route>
          <Route path="/login">
            <LoginPage />
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
