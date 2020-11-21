import * as React from 'react';
import ReactDOM from 'react-dom';
import { FirebaseAppProvider, SuspenseWithPerf } from 'reactfire';

import App from './app';
import firebaseConfig from './util/firebaseConfig';

const AppWrapper: React.FC = () => (
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    {/* TODO: replace with actual loading component, QUIZ-12 */}
    <SuspenseWithPerf fallback={<h2>Loading...</h2>} traceId="app-load">
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </SuspenseWithPerf>
  </FirebaseAppProvider>
);

ReactDOM.unstable_createRoot(document.getElementById('root')).render(<AppWrapper />);
