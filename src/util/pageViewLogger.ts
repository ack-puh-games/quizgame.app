import * as React from 'react';
import { useAnalytics } from 'reactfire';
import { useLocation } from 'react-router-dom';

// NOTE: this is broken until we can upgrade Firebase to version 8 (which is blocked by Reactfire).
const PageViewLogger: React.FC = () => {
  const analytics = useAnalytics();
  const location = useLocation();

  React.useEffect(() => {
    analytics.logEvent('page_view', { page_path: location.pathname });
  }, [location.pathname]);

  return null;
};

export default PageViewLogger;
