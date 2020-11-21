import * as React from 'react';
import { useAnalytics } from 'reactfire';
import { useLocation } from 'react-router-dom';

const PageViewLogger: React.FC = () => {
  const analytics = useAnalytics();
  const location = useLocation();

  React.useEffect(() => {
    analytics.logEvent('page_view', { page_path: location.pathname });
  }, [location.pathname]);

  return null;
};

export default PageViewLogger;
