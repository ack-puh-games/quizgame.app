import * as React from 'react';
import { AuthCheck } from 'reactfire';
import { Helmet } from 'react-helmet';
import { Redirect, useLocation } from 'react-router-dom';

import { Page } from './';

interface PageWrapperProps {
  authCheckRequired?: boolean;
  children?: React.ReactNode;
  title: string;
  traceId: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  authCheckRequired = true,
  children,
  title,
  traceId,
}: PageWrapperProps) => {
  const location = useLocation();

  return (
    /* TODO: replace with actual loading component, QUIZ-12 */
    /* TODO: replace React.Suspense with SuspenseWithPerf after upgrade to firebase@^8, QUIZ-13 */
    // <React.Suspense fallback={<h2>Loading...</h2>} traceId={traceId}>
    <React.Suspense fallback={<h2>Loading...</h2>}>
      {authCheckRequired ? (
        <AuthCheck
          fallback={<Redirect to={`/login?from=${location.pathname}`} />}
        >
          <Helmet>
            <title>{title}</title>
          </Helmet>
          <Page>{children}</Page>
        </AuthCheck>
      ) : (
        <>
          <Helmet>
            <title>{title}</title>
          </Helmet>
          <Page>{children}</Page>
        </>
      )}
    </React.Suspense>
  );
};

export default PageWrapper;
