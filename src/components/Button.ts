import tw, { css, styled, theme } from 'twin.macro';

interface ButtonProps {
  isSmall?: boolean;
  fullWidth?: boolean;
}

export const Button = styled.button<ButtonProps>(({ isSmall, fullWidth }) => [
  tw`px-8 py-2 text-lg rounded focus:outline-none`,
  tw`text-white bg-black`,
  tw`hocus:(bg-gray-900)`,

  isSmall ? tw`text-sm` : tw`text-lg`,
  fullWidth && tw`container`,

  css`
    color: ${theme`colors.white`};
  `,
]);

export default Button;
