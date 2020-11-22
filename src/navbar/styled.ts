import tw, { styled } from 'twin.macro';
import { Link, useLocation } from 'react-router-dom';

import { UserAvatar } from '../components';

export const NavContainer = styled.nav(() => [
  tw`bg-gray-800`,
]);

export const StyledNavBar = styled.div(() => [
  tw`max-w-6xl mx-auto px-2 sm:px-6 lg:px-8`,
]);

export const NavItemsWrapper = styled.div(() => [
  tw`relative flex items-center justify-between h-16`,
]);

export const NavLeftSide = styled.div(() => [
  tw`flex-1 flex items-center justify-center sm:items-stretch sm:justify-start space-x-4`,
]);

export const NavRightSide = styled.div(() => [
  tw`absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0`,
]);

export const NavItem = styled(Link)(({ to }) => {
  const location = useLocation();
  return [
    tw`px-3 py-2 rounded-md text-sm font-medium`,
    location.pathname === to ? tw`text-white bg-gray-900` : tw`text-gray-300 hover:text-white hover:bg-gray-700`,
  ]
});

export const NavUserAvatarContainer = styled.div(() => [
  tw`ml-3 relative`,
]);

export const NavUserAvatarButton = styled.button(() => [
  tw`bg-gray-800 flex text-sm rounded-full focus:outline-none focus:shadow-outline`,
]);

export const NavUserAvatar = styled(UserAvatar)(() => [
  tw`h-8 w-8`,
]);
