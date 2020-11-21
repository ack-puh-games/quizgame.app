import 'regenerator-runtime/runtime'
import * as React from 'react';
import ReactDOM from 'react-dom';

import { Global } from '@emotion/react'
import { FirebaseAppProvider } from 'reactfire';
import { Helmet } from 'react-helmet';

import App from './app';
import firebaseConfig from './util/firebaseConfig';

const AppWrapper: React.FC = () => (
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    {/* TODO: replace with actual loading component, QUIZ-12 */}
    {/* TODO: replace React.Suspense with SuspenseWithPerf after upgrade to firebase@^8, QUIZ-13 */}
    <React.Suspense fallback={<h2>Loading...</h2>} traceId="app-load">
      <Global
        styles={{
          'html, body': {
            margin: 0,
            padding: 0,
          }
        }}
      />
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
);

ReactDOM.unstable_createRoot(document.getElementById('root')).render(<AppWrapper />);
