import * as React from 'react';
import * as firebase from 'firebase/app';
import {
  useDatabase,
  useFirestore,
  useFirestoreCollectionData,
  useUser,
} from 'reactfire';
import { Link, useHistory } from 'react-router-dom';

import {
  BoardCard,
  CardsContainer,
  CommonWrapper,
  Header,
} from '../components';
import { IBoard } from '../interfaces';
import PageWrapper from '../util/PageWrapper';

import { EmptyImage } from './styled';

const GameConfigurator: React.FC = () => {
  const user = useUser<firebase.User>();
  const firestore = useFirestore();
  const database = useDatabase();
  const history = useHistory();

  const boardsQuery = firestore
    .collection('boards')
    .where('owner', '==', user.uid)
    .orderBy('name');

  const boards = useFirestoreCollectionData<IBoard>(boardsQuery, {
    idField: 'id',
  });

  const createGame = async (boardId: string) => {
    if (!boardId.length) {
      return;
    }

    const gameRef = await database.ref('/games').push({
      host: user.uid,
      board: boardId,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      isStarted: false,
      isFinished: false,
    });

    history.push(`/game/play/${gameRef.key}`);
  };

  return (
    <CommonWrapper>
      {boards.length === 0 ? (
        <>
          <EmptyImage />
          <Header>You have no boards!</Header>
          <span>
            You'll need to <Link to="/editor?create=1">create a board</Link>{' '}
            before you can create a new game.
          </span>
        </>
      ) : (
        <>
          <Header>Choose a board to use</Header>
          <CardsContainer>
            {boards.map((board) => (
              <BoardCard
                board={board}
                key={board.id}
                onClick={() => createGame(board.id || '')}
              />
            ))}
          </CardsContainer>
        </>
      )}
    </CommonWrapper>
  );
};

const GameConfiguratorPage: React.FC = () => (
  <PageWrapper title="Create a game" traceId="game-config-page">
    <GameConfigurator />
  </PageWrapper>
);

export default GameConfiguratorPage;
