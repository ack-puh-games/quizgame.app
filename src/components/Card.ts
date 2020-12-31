import tw, { css, styled } from 'twin.macro';

export const CardGrid = styled.div(() => [
  css`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(6, 1fr);
  `,
]);

export const CardsContainer = styled.div(() => [tw`flex flex-row flex-wrap`]);

export const CardContainer = styled.div(() => [tw`w-64 h-32 m-1`]);

export const EditorCard = styled.div(() => [
  tw`flex flex-row p-1 pb-6 bg-white rounded shadow-md`,
  tw`w-full h-full`,
  tw`items-center justify-center`,
  tw`hocus:(ring) focus-within:ring`,
]);

interface CardProps {
  isSelectable?: boolean;
}

export const Card = styled.div<CardProps>(({ isSelectable = false }) => [
  tw`flex flex-row bg-white rounded shadow-md`,
  tw`w-full h-full px-1 select-none`,
  tw`items-center justify-center`,
  isSelectable && tw`hocus:(ring) focus-within:ring cursor-pointer`,
  !isSelectable && tw`cursor-default`,
]);

export const CardEditableData = styled.textarea(() => [
  tw`w-full h-full overflow-x-hidden text-lg font-bold border-0`,
  css`
    white-space: normal;
    text-align: center;
    resize: none;
    box-shadow: none !important;
  `,
]);

interface CardDataProps {
  isLargeText?: boolean;
  isSmallText?: boolean;
}

export const CardData = styled.div<CardDataProps>(
  ({ isLargeText = false, isSmallText = false }) => [
    tw`flex items-center justify-center text-center`,
    tw`text-3xl font-extrabold border-0`,
    isLargeText && tw`text-6xl`,
    isSmallText && tw`text-xl`,
  ],
);

interface CardWrapperProps {
  posX: number;
  posY: number;
}

export const CardWrapper = styled.div<CardWrapperProps>(({ posX, posY }) => [
  tw`relative`,
  posX &&
    css`
      grid-column-start: ${posX};
      grid-column-end: ${posX + 1};
    `,
  posY &&
    css`
      grid-row-start: ${posY};
      grid-row-end: ${posY + 1};
    `,
]);
