import tw, { styled } from 'twin.macro';

interface ButtonProps {
  isSmall?: boolean;
  fullWidth?: boolean;
  isPrimary?: boolean;
}

export const Button = styled.button<ButtonProps>(
  ({ isSmall, fullWidth, isPrimary }) => [
    tw`px-8 py-2 text-lg rounded focus:outline-none`,
    tw`font-bold text-gray-300 bg-gray-800`,
    tw`hocus:(bg-gray-700)`,

    isSmall ? tw`text-sm` : tw`text-xl`,
    fullWidth && tw`container`,
    isPrimary && tw`ring-purple-300 ring-2`,
  ],
);

export default Button;
