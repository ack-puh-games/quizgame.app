import * as React from 'react';
import { AuthCheck } from 'reactfire';

import { NavContainer, NavItem, NavItemsWrapper, NavLeftSide, NavRightSide, NavUserAvatarContainer, StyledNavBar } from './styled';
import UserMenu from './UserMenu';

const NavBar: React.FC = () => {
  return (
    <NavContainer>
      <StyledNavBar>
        <NavItemsWrapper>
          <NavLeftSide>
            <NavItem to="/">Home</NavItem>
            <NavItem to="/editor">Editor</NavItem>
          </NavLeftSide>

          <NavRightSide>
            <AuthCheck fallback={null}>
              <NavUserAvatarContainer>
                <UserMenu />
              </NavUserAvatarContainer>
            </AuthCheck>
          </NavRightSide>
        </NavItemsWrapper>
      </StyledNavBar>
    </NavContainer>
  );
};

export default NavBar;
