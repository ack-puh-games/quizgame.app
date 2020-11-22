import * as React from 'react';
import { AuthCheck as RealAuthCheck } from 'reactfire';
import { Helmet } from 'react-helmet';
import { Redirect, useLocation } from 'react-router-dom';

import Page from './Page';

interface PageWrapperProps {
  authCheckRequired?: boolean;
  children?: React.ReactNode;
  title: string;
  traceId: string;
}

const NullAuthCheck = ({ children, fallback }) => children;

const PageWrapper: React.FC<PageWrapperProps> = ({
  authCheckRequired = true,
  children,
  title,
  traceId,
}: PageWrapperProps) => {
  const location = useLocation();
  const AuthCheck = authCheckRequired ? RealAuthCheck : NullAuthCheck;
  return (
    /* TODO: replace with actual loading component, QUIZ-12 */
    /* TODO: replace React.Suspense with SuspenseWithPerf after upgrade to firebase@^8, QUIZ-13 */
    <React.Suspense fallback={<h2>Loading...</h2>} traceId={traceId}>
      <AuthCheck
        fallback={<Redirect to={`/login?from=${location.pathname}`} />}
      >
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Page>{children}</Page>
      </AuthCheck>
    </React.Suspense>
  );
};

export default PageWrapper;
