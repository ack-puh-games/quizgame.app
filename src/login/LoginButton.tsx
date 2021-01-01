import * as React from 'react';
import firebase from 'firebase/app';
import { useAuth } from 'reactfire';
import { useHistory } from 'react-router-dom';

import { Button } from '../components';
import useQuery from '../util/useQuery';

const LoginButton: React.FC = () => {
  const auth = useAuth();
  const history = useHistory();
  const query = useQuery();

  const signIn = async () => {
    await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());

    history.push(query.get('from') || '/');
  };

  return (
    <Button onClick={signIn} isPrimary>
      Log In With Google
    </Button>
  );
};

export default LoginButton;
