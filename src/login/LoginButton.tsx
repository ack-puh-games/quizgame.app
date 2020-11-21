import * as React from 'react';
import firebase from 'firebase/app';
import { useAuth } from 'reactfire';

const LoginButton: React.FC = () => {
  const auth = useAuth();

  const signIn = async () => {
    await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  };

  return (
    <button onClick={signIn}>
      Sign In With Google
    </button>
  )
};

export default LoginButton;
