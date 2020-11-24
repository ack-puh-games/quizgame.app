import * as React from 'react';
import { User } from 'firebase';
import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';
import { useHistory } from 'react-router-dom';

import { Button } from '../components';
import { CommonWrapper } from '../util/styled';

import { BoardCard } from './BoardCard';
import { Board, defaultCategories, defaultQuestions } from './staticData';
import {
  CardsContainer,
  CreateBoardModal,
  EmptyImage,
  Header,
  EmptyBoardCardContainer,
  EmptyBoardCard,
} from './styled';

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
      created: Date.now(),
      edited: Date.now(),
    });

    defaultCategories.forEach(async (catData) => {
      const category = await board.collection('categories').add({
        name: catData.name,
      });

      defaultQuestions.forEach(async (qData) => {
        await board.collection('questions').add({
          ...qData,
          categoryId: category.id,
        });
      });
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
            <CardsContainer>
              {boards.map((board) => (
                <BoardCard board={board} key={board.id} />
              ))}
              <EmptyBoardCardContainer>
                <EmptyBoardCard onClick={() => setShowCreationModal(true)}>
                  New Board
                </EmptyBoardCard>
              </EmptyBoardCardContainer>
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
