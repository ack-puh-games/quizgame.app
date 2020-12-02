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
          <Route path="/editor/board/:boardId" render={() => <EditorPage />} />
          <Route path="/editor" render={() => <BoardsListPage />} />
          <Route path="/game/play/:gameId" render={() => <GamePlayPage />} />
          <Route path="/game/host/:gameId" render={() => <GameHostPage />} />
          <Route path="/game/new" render={() => <GameConfiguratorPage />} />
          <Route path="/game" render={() => <Redirect to="/game/new" />} />
          <Route path="/login" render={() => <LoginPage />} />
          <Route path="/" render={() => <Redirect to="/game/new" />} />
        </Switch>
      </div>

      {/* Uncomment after upgrading Firebase dependency. QUIZ-13 */}
      {/* <PageViewLogger /> */}
    </Router>
  );
};

export default App;
