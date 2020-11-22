import 'regenerator-runtime/runtime'
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { FirebaseAppProvider } from 'reactfire';
import { Helmet } from 'react-helmet';
import { GlobalStyles } from 'twin.macro';
import './styles.css';

import App from './app';
import firebaseConfig from './util/firebaseConfig';

const AppWrapper: React.FC = () => (
  <div className="min-h-screen bg-white">
    <GlobalStyles />
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      {/* TODO: replace with actual loading component, QUIZ-12 */}
      {/* TODO: replace React.Suspense with SuspenseWithPerf after upgrade to firebase@^8, QUIZ-13 */}
      <React.Suspense fallback={<h2>Loading...</h2>} traceId="app-load">
        <Helmet
          defaultTitle="Quiz Site"
          titleTemplate="%s | Quiz Site"
        >
            <meta charSet="utf-8" />
            <title>Home</title>
        </Helmet>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </React.Suspense>
    </FirebaseAppProvider>
  </div>
);

ReactDOM.unstable_createRoot(document.getElementById('root')).render(<AppWrapper />);
