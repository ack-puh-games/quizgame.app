import * as React from 'react';
import { User } from 'firebase';
import { useAuth, useUser } from 'reactfire';

import { NavUserAvatar, NavUserAvatarButton } from './styled';

const UserMenu: React.FC = () => {
  const auth = useAuth();
  const { photoURL } = useUser<User>();

  const signOut = async () => {
    await auth.signOut();
  };

  return (
    <NavUserAvatarButton onClick={signOut} title="Log Out">
      <NavUserAvatar src={photoURL || undefined} />
    </NavUserAvatarButton>
  );
};

export default UserMenu;
