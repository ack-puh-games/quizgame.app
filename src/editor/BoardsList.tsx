import * as React from 'react';
import { User } from 'firebase';
import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';
import { useHistory } from 'react-router-dom';

import { Button } from '../components';
import { CommonWrapper } from '../util/styled';

import { Board, defaultBoardData } from './staticData';
import {
  BoardCardContainer,
  BoardCard,
  BoardIcon,
  CardsContainer,
  CreateBoardModal,
  EmptyImage,
  Header,
  BoardIconContainer,
  BoardFlexColumn,
  BoardCardHeader,
  BoardCardData,
  ActionsContainer,
} from './styled';

const calculateQuestions = (board: Board) => {
  let totalEditedQuestions = 0;

  board.boardData.categories.forEach((catData) => {
    catData.questions.forEach((qData) => {
      if (qData.edited) {
        totalEditedQuestions += 1;
      }
    });
  });

  return totalEditedQuestions;
};

const BoardsList: React.FC = () => {
  const [showCreationModal, setShowCreationModal] = React.useState<boolean>(
    false,
  );
  const [newBoardName, setNewBoardName] = React.useState<string>('');

  const history = useHistory();
  const user = useUser<User>();
  const firestore = useFirestore();

  const boardsQuery = firestore
    .collection('boards')
    .where('owner', '==', user.uid)
    .orderBy('name');

  const boards = useFirestoreCollectionData<Board>(boardsQuery, {
    idField: 'id',
  });

  const createBoard = async () => {
    if (!newBoardName.length) {
      return;
    }

    const board = await firestore.collection('boards').add({
      owner: user.uid,
      name: newBoardName,
      boardData: defaultBoardData,
      created: Date.now(),
      edited: Date.now(),
    });

    history.push(`/editor/board/${board.id}`);

    closeModal();
  };

  const closeModal = () => {
    setShowCreationModal(false);
    setNewBoardName('');
  };

  return (
    <>
      <CommonWrapper>
        {boards.length === 0 ? (
          <>
            <EmptyImage />
            <Header>You have no boards!</Header>
            <Button type="button" onClick={() => setShowCreationModal(true)}>
              Create a board
            </Button>
          </>
        ) : (
          <>
            <ActionsContainer>
              <Button type="button" onClick={() => setShowCreationModal(true)}>
                Create new Board
              </Button>
            </ActionsContainer>
            <CardsContainer>
              {boards.map((board) => (
                <BoardCardContainer
                  key={board.id}
                  to={`/editor/board/${board.id}`}
                >
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
                        <BoardCardData>
                          {calculateQuestions(board)} / 30
                        </BoardCardData>
                      </BoardFlexColumn>
                    </BoardFlexColumn>
                  </BoardCard>
                </BoardCardContainer>
              ))}
            </CardsContainer>
          </>
        )}
      </CommonWrapper>
      <CreateBoardModal
        closeModal={closeModal}
        createBoard={createBoard}
        newBoardName={newBoardName}
        setNewBoardName={setNewBoardName}
        showCreationModal={showCreationModal}
      />
    </>
  );
};

export default BoardsList;
