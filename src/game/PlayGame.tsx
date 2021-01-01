import * as React from 'react';
import { useAuth, useDatabase, useDatabaseObjectData } from 'reactfire';
import { useParams, useHistory } from 'react-router-dom';

import {
  Card,
  CardContainer,
  CardData,
  CardGrid,
  CardWrapper,
  CommonWrapper,
  CurrentQuestion,
  GameComplete,
  PageWrapper,
  ScoreDisplay,
} from '../components';
import { IGame } from '../interfaces';
import { useBoardData } from './useBoardData';

interface GamePageParams {
  gameId?: string;
}

const PlayGame: React.FC = () => {
  const { currentUser } = useAuth();
  const history = useHistory();
  const { gameId } = useParams<GamePageParams>();
  const database = useDatabase();

  const gameDataRef = database.ref(`/games/${gameId}`);
  const gameData = useDatabaseObjectData<IGame>(gameDataRef);

  if (!gameData.board || !gameId) {
    history.push('/');
  }

  // runs when currentUser changes
  React.useEffect(() => {
    if (!currentUser) {
      return;
    }
    if (
      gameData.board &&
      (!gameData.players || !gameData.players[currentUser.uid])
    ) {
      gameDataRef.child('players').child(currentUser.uid).set({
        id: currentUser.uid,
        connected: true,
        name: currentUser.displayName,
        image: currentUser.photoURL,
      });
    } else {
      gameDataRef
        .child('players')
        .child(currentUser.uid)
        .child('connected')
        .set(true);
    }

    gameDataRef
      .child('players')
      .child(currentUser.uid)
      .child('connected')
      .onDisconnect()
      .set(false);
  }, [currentUser]);

  const { categories, catQuestionMap } = useBoardData({
    gameId,
    board: gameData.board,
  });

  return (
    <CommonWrapper>
      <CardGrid>
        {categories.map((catData) => (
          <CardWrapper key={catData.id} posX={catData.pos} posY={1}>
            <CardContainer>
              <Card>
                <CardData>{catData.name}</CardData>
              </Card>
            </CardContainer>
          </CardWrapper>
        ))}
        {catQuestionMap.map((catData) =>
          catData.questions.map((qData) => (
            <CardWrapper
              key={`${catData.id}${qData.index}`}
              posX={catData.pos}
              posY={qData.index}
            >
              <CardContainer>
                <Card>
                  <CardData isLargeText>
                    {qData.value.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </CardData>
                </Card>
              </CardContainer>
            </CardWrapper>
          )),
        )}
      </CardGrid>

      <CurrentQuestion gameId={gameId || ''} isHosting={false} />
      <ScoreDisplay gameId={gameId || ''} />
      <GameComplete gameId={gameId || ''} />
    </CommonWrapper>
  );
};

const PlayGamePage: React.FC = () => (
  <PageWrapper title="Play" traceId="play-game-page">
    <PlayGame />
  </PageWrapper>
);

export default PlayGamePage;
