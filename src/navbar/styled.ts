import tw, { styled } from 'twin.macro';
import { Link, useLocation } from 'react-router-dom';

import { UserAvatar } from '../components';

export const NavContainer = styled.nav(() => [
  tw`bg-gray-600 shadow-lg ring-2 ring-purple-300`,
]);

export const StyledNavBar = styled.div(() => [
  tw`max-w-6xl px-2 mx-auto sm:px-6 lg:px-8`,
]);

export const NavItemsWrapper = styled.div(() => [
  tw`relative flex items-center justify-between h-16`,
]);

export const NavLeftSide = styled.div(() => [
  tw`flex items-center justify-center flex-1 space-x-4 sm:items-stretch sm:justify-start`,
]);

export const NavRightSide = styled.div(() => [
  tw`absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0`,
]);

export const StyledNavItem = styled.a(() => [
  tw`flex flex-row items-center justify-center px-3 py-2 text-sm font-medium rounded-md`,
  tw`text-gray-300 hover:text-white hover:bg-gray-700`,
]);

export const NavItem = styled(Link)(({ to }) => {
  const location = useLocation();
  const pathname = `/${location.pathname.split('/')[1]}`;

  return [
    tw`flex flex-row items-center justify-center px-3 py-2 text-sm font-medium rounded-md`,
    pathname === to
      ? tw`text-white bg-gray-900`
      : tw`text-gray-300 hover:text-white hover:bg-gray-700`,
  ];
});

export const NavUserAvatarContainer = styled.div(() => [tw`relative ml-3`]);

export const NavUserAvatarButton = styled.button(() => [
  tw`flex text-sm bg-gray-800 rounded-full focus:outline-none focus:ring`,
]);

export const NavUserAvatar = styled(UserAvatar)(() => [tw`w-8 h-8`]);
