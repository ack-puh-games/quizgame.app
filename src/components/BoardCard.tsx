import * as React from 'react';
import tw, { css, styled } from 'twin.macro';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { Link } from 'react-router-dom';

import { default as BoardIconComponent } from './BoardIcon';

export { BoardIconComponent };

export const BoardCardContainer = styled.div(() => [tw`w-64 h-32 m-2`]);

export const BoardCard = styled.div(() => [
  tw`flex flex-row p-4 bg-white rounded shadow-sm`,
  tw`w-full h-full cursor-pointer hover:bg-gray-100`,
]);

export const BoardIconContainer = styled.div(() => [
  tw`flex items-center justify-center flex-shrink-0 w-12 h-12`,
  tw`text-white shadow-md bg-gradient-to-br from-pink-300 to-indigo-700 rounded-xl`,
]);

export const BoardIcon = styled(BoardIconComponent)(() => [tw`w-8`]);

export const BoardFlexColumn = styled.div(() => [
  tw`flex flex-col flex-grow ml-4`,
]);

export const BoardCardHeader = styled.span(() => [tw`text-sm text-gray-500`]);

export const BoardCardData = styled.span(() => [
  tw`w-32 text-lg font-bold`,
  css`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  `,
]);

import { IBoard } from '../interfaces';

interface BoardCardProps {
  board: IBoard;
  to?: string;
  onClick?: () => void;
}

export const BoardCardComponent: React.FC<BoardCardProps> = ({
  board,
  to,
  onClick,
}: BoardCardProps) => {
  const firestore = useFirestore();
  const questionsQuery = firestore
    .collection('boards')
    .doc(board.id)
    .collection('questions')
    .where('edited', '==', true);

  const questions = useFirestoreCollectionData(questionsQuery);

  const BoardCardOutput = () => (
    <BoardCardContainer onClick={onClick}>
      <BoardCard>
        <BoardIconContainer>
          <BoardIcon />
        </BoardIconContainer>
        <BoardFlexColumn>
          <BoardFlexColumn>
            <BoardCardHeader>Name</BoardCardHeader>
            <BoardCardData>{board.name}</BoardCardData>
          </BoardFlexColumn>
          <BoardFlexColumn>
            <BoardCardHeader>Questions</BoardCardHeader>
            <BoardCardData>{questions.length} / 30</BoardCardData>
          </BoardFlexColumn>
        </BoardFlexColumn>
      </BoardCard>
    </BoardCardContainer>
  );

  if (to) {
    return (
      <Link to={to}>
        <BoardCardOutput />
      </Link>
    );
  }

  return <BoardCardOutput />;
};

export default BoardCardComponent;