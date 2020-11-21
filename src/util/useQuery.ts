import { useLocation } from 'react-router-dom';

const useQuery = () => {
  const location = useLocation();

  // Why couldn't react-router-dom just include this?
  return new URLSearchParams(location.search);
}

export default useQuery;
