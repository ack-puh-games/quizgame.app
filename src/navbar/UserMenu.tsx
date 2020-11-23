import * as React from 'react';
import { User } from 'firebase';
import { useAuth, useUser } from 'reactfire';
import { useHistory } from 'react-router-dom';

import { NavUserAvatar, NavUserAvatarButton } from './styled';

const UserMenu: React.FC = () => {
  const auth = useAuth();
  const { photoURL } = useUser<User>();
  const history = useHistory();

  const signOut = async () => {
    await auth.signOut();

    history.push('/');

    // if we don't reload after signing out, we'll see weird Firebase errors when logging back in.
    window.location.reload();
  };

  return (
    <NavUserAvatarButton onClick={signOut} title="Log Out">
      <NavUserAvatar src={photoURL || undefined} />
    </NavUserAvatarButton>
  );
};

export default UserMenu;
