import * as React from 'react';
import { useAuth, AuthCheck } from 'reactfire';

const LogoutButton: React.FC = () => {
  const auth = useAuth();

  const signOut = async () => {
    await auth.signOut();
  };

  return (
    <AuthCheck fallback={() => null}>
      <button onClick={signOut}>
        Log Out
      </button>
    </AuthCheck>
  )
};

export default LogoutButton;
