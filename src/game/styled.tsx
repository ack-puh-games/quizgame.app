import tw, { styled } from 'twin.macro';

import { EmptyImage as EmptyImageComponent } from '../components';

export const EmptyImage = styled(EmptyImageComponent)(() => [
  tw`w-full max-w-lg my-8`,
]);
