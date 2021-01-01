import { Link as RouterLink } from 'react-router-dom';
import tw, { styled } from 'twin.macro';

import { EmptyImage as EmptyImageComponent } from '../components';

export const EmptyImage = styled(EmptyImageComponent)(() => [
  tw`w-full max-w-lg my-8`,
]);

export const Header = styled.span(() => [tw`mb-8 text-3xl font-bold`]);
export const Subtitle = styled.span(() => [tw`text-xl`]);
export const Link = styled(RouterLink)(() => [tw`font-bold underline`]);
