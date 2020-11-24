import * as React from 'react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';

import { Board } from './staticData';
import {
  BoardCardContainer,
  BoardCard as StyledBoardCard,
  BoardIcon,
  BoardIconContainer,
  BoardFlexColumn,
  BoardCardHeader,
  BoardCardData,
} from './styled';

interface BoardCardProps {
  board: Board;
}

export const BoardCard: React.FC<BoardCardProps> = ({
  board,
}: BoardCardProps) => {
  const firestore = useFirestore();
  const questionsQuery = firestore
    .collection('boards')
    .doc(board.id)
    .collection('questions')
    .where('edited', '==', true);

  const questions = useFirestoreCollectionData(questionsQuery);

  return (
    <BoardCardContainer to={`/editor/board/${board.id}`}>
      <StyledBoardCard>
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
      </StyledBoardCard>
    </BoardCardContainer>
  );
};

export default BoardCard;
