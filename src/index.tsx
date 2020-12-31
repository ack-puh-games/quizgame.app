import 'regenerator-runtime/runtime';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Global, css } from '@emotion/react';
import { FirebaseAppProvider } from 'reactfire';
import { Helmet } from 'react-helmet';
import tw, { GlobalStyles, styled } from 'twin.macro';

import App from './app';
import firebaseConfig from './util/firebaseConfig';

const AppContainer = styled.div(() => [
  tw`min-h-full text-gray-800 bg-gray-200`,
]);

const AppWrapper: React.FC = () => (
  <AppContainer>
    <GlobalStyles />
    <Global
      styles={css`
        html,
        body,
        #root {
          margin: 0;
          padding: 0;
          min-height: 100%;
          height: 100%;
        }
      `}
    />
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      {/* TODO: replace with actual loading component, QUIZ-12 */}
      {/* TODO: replace React.Suspense with SuspenseWithPerf after upgrade to firebase@^8, QUIZ-13 */}
      {/* <React.Suspense fallback={<h2>Loading...</h2>} traceId="app-load"> */}
      <React.Suspense fallback={<h2>Loading...</h2>}>
        <Helmet defaultTitle="Quiz Site" titleTemplate="%s | Quiz Site">
          <meta charSet="utf-8" />
          <title>Home</title>
        </Helmet>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </React.Suspense>
    </FirebaseAppProvider>
  </AppContainer>
);

// @ts-ignore experimental features aren't in the types yet...
ReactDOM.unstable_createRoot(document.getElementById('root')).render(
  <AppWrapper />,
);
