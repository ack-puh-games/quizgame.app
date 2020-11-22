import tw, { css, styled, theme } from 'twin.macro';

interface ButtonProps {
  isPrimary?: boolean;
  isSecondary?: boolean;
  isSmall?: boolean;
}

export const Button = styled.button<ButtonProps>(({ isPrimary, isSecondary, isSmall }) => [
  tw`text-lg px-8 py-2 rounded focus:outline-none`,
  tw`transform transition-transform duration-75`,
  tw`hocus:(scale-105 text-yellow-400)`,

  isPrimary && tw`bg-black text-white border-black`,
  isSecondary && tw`border-2 border-yellow-600`,
  isSmall ? tw`text-sm` : tw`text-lg`,

  css`
    color: ${theme`colors.white`};
  `
]);

export default Button;
