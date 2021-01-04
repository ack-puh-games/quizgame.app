import * as React from 'react';
import { User } from 'firebase';
import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';
import { useHistory } from 'react-router-dom';

import {
  BoardCard,
  Button,
  CardsContainer,
  CommonWrapper,
  Header,
  PageWrapper,
} from '../components';
import { IBoard } from '../interfaces';
import { useKeyPress } from '../util/useKeyPress';
import useQuery from '../util/useQuery';

import { defaultCategories, defaultQuestions } from './staticData';
import {
  CreateBoardModal,
  EmptyImage,
  EmptyBoardCardContainer,
  EmptyBoardCard,
} from './styled';

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

const BoardsList: React.FC = () => {
  const [showCreationModal, setShowCreationModal] = React.useState<boolean>(
    false,
  );
  const [newBoardName, setNewBoardName] = React.useState<string>('');
  const [isCreatingBoard, setIsCreatingBoard] = React.useState<boolean>(false);

  const history = useHistory();
  const user = useUser<User>();
  const firestore = useFirestore();
  const query = useQuery();
  const isEnterPressed = useKeyPress('Enter');

  const boardsQuery = firestore
    .collection('boards')
    .where('owner', '==', user.uid)
    .orderBy('name');

  const boards = useFirestoreCollectionData<IBoard>(boardsQuery, {
    idField: 'id',
  });

  React.useEffect(() => {
    if (query.get('create')) {
      setShowCreationModal(true);
      history.replace('/editor');
    }
  }, [query]);

  React.useEffect(() => {
    if (isEnterPressed) {
      createBoard();
    }
  }, [isEnterPressed]);

  const createBoard = async () => {
    if (isCreatingBoard) {
      return;
    }
    if (!newBoardName.length) {
      return;
    }

    setIsCreatingBoard(true);

    const board = await firestore.collection('boards').add({
      owner: user.uid,
      name: newBoardName,
      created: Date.now(),
      edited: Date.now(),
    });

    for (const catData of defaultCategories) {
      board
        .collection('categories')
        .add(catData)
        .then((category) => {
          for (const qData of defaultQuestions) {
            board.collection('questions').add({
              ...qData,
              categoryId: category.id,
            });
          }
        });
    }

    history.push(`/editor/board/${board.id}`);

    closeModal();
    setIsCreatingBoard(false);
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
            <Button
              type="button"
              onClick={() => setShowCreationModal(true)}
              isPrimary
            >
              Create a board
            </Button>
          </>
        ) : (
          <>
            <CardsContainer>
              {boards.map((board) => (
                <BoardCard
                  board={board}
                  to={`/editor/board/${board.id}`}
                  key={board.id}
                />
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
        isCreatingBoard={isCreatingBoard}
      />
    </>
  );
};

const BoardsListPage: React.FC = () => (
  <PageWrapper title="Board Editor" traceId="editor-page">
    <BoardsList />
  </PageWrapper>
);

export default BoardsListPage;
