import * as React from 'react';
import { AuthCheck as RealAuthCheck, SuspenseWithPerf } from 'reactfire';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';

interface PageWrapperProps {
  authCheckRequired: boolean;
  title: string;
  traceId: string;
}

const NullAuthCheck: React.FC = ({ children }) => (children);

const PageWrapper: React.FC<PageWrapperProps> = ({ authCheckRequired = true, children, title, traceId }) => {
  const AuthCheck = authCheckRequired ? RealAuthCheck : NullAuthCheck;
  return (
    /* TODO: replace with actual loading component, QUIZ-12 */
    <SuspenseWithPerf fallback={<h2>Loading...</h2>} traceId={traceId}>
      <AuthCheck fallback={<Redirect to="/login" />}>
        <Helmet>
          <title>{ title }</title>
        </Helmet>
        { children }
      </AuthCheck>
    </SuspenseWithPerf>
  );
};

export default PageWrapper;
