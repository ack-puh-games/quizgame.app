import * as React from 'react';
import { useAuth, useUser } from 'reactfire';

import { StyledUserAvatar } from './styled';

const UserAvatar: React.FC = () => {
  const auth = useAuth();
  const { photoURL } = useUser();

  const signOut = async () => {
    await auth.signOut();
  };

  return (
    <StyledUserAvatar onClick={signOut} title="Log Out">
      <img src={photoURL} />
    </StyledUserAvatar>
  )
};

export default UserAvatar;
