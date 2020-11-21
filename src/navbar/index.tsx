import * as React from 'react';
import { Link } from "react-router-dom";
import { AuthCheck, useUser } from 'reactfire';

import { StyledNavBar } from './styled';
import UserAvatar from './UserAvatar';

const NavBar: React.FC = () => {
  const user = useUser();

  return (
    <StyledNavBar>
      <div>
        <Link to="/">Home</Link>
        <Link to="/editor">Editor</Link>
      </div>
      <div>
        <AuthCheck fallback={null}>
          <UserAvatar />
        </AuthCheck>
      </div>
    </StyledNavBar>
  );
};

export default NavBar;
