import * as React from 'react';
import tw, { css, styled } from 'twin.macro';
import { AuthCheck } from 'reactfire';
import { IconDiscord } from '../components';

import {
  NavContainer,
  NavItem,
  NavItemsWrapper,
  NavLeftSide,
  NavRightSide,
  NavUserAvatarContainer,
  StyledNavBar,
  StyledNavItem,
} from './styled';
import UserMenu from './UserMenu';

const DiscordIcon = styled(IconDiscord)(() => [tw`w-6 mr-2`]);
const DiscordNavItem = styled(StyledNavItem)(() => [
  tw`flex flex-row items-center justify-center text-white`,
  css`
    background-color: #7289da;
    &:hover {
      background-color: #5975d8;
    }
  `,
]);

const NavBar: React.FC = () => {
  return (
    <NavContainer>
      <StyledNavBar>
        <NavItemsWrapper>
          <NavLeftSide>
            <NavItem to="/game">Game</NavItem>
            <NavItem to="/editor">Editor</NavItem>
            <DiscordNavItem
              href="https://discord.com/invite/tHFYcdmcd9"
              target="_blank"
            >
              <DiscordIcon />
              Join us on Discord
            </DiscordNavItem>
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
