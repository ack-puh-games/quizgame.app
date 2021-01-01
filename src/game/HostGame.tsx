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
  PageWrapper,
  ScoreDisplay,
} from '../components';
import { IGame } from '../interfaces';

import { useBoardData } from './useBoardData';

interface GamePageParams {
  gameId?: string;
}

const HostGame: React.FC = () => {
  const { currentUser } = useAuth();
  const history = useHistory();
  const { gameId } = useParams<GamePageParams>();
  const database = useDatabase();

  const gameDataRef = database.ref(`/games/${gameId}`);
  const gameData = useDatabaseObjectData<IGame>(gameDataRef);

  if (!gameData.board || !gameId) {
    history.push('/');
  }

  React.useEffect(() => {
    if (currentUser?.uid && !(currentUser?.uid === gameData.host)) {
      return history.push(`/game/play/${gameId}`);
    }
  }, [currentUser]);

  const { categories, catQuestionMap } = useBoardData({
    gameId,
    board: gameData.board,
  });

  const selectQuestion = (questionId: string) => {
    gameDataRef.child('currentQuestion').remove();
    gameDataRef.child('currentQuestion').set({
      questionId,
    });
    gameDataRef.child('questions').child(questionId).remove();
  };

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
          catData.questions.map((qData, index) => (
            <CardWrapper
              key={qData.id}
              posX={catData.pos}
              posY={qData.value / 200 + 1}
              onClick={() => selectQuestion(qData.id || '')}
            >
              <CardContainer>
                <Card isSelectable>
                  <CardData isLargeText>${qData.value}</CardData>
                </Card>
              </CardContainer>
            </CardWrapper>
          )),
        )}
      </CardGrid>

      <CurrentQuestion gameId={gameId || ''} isHosting />
      <ScoreDisplay gameId={gameId || ''} />
    </CommonWrapper>
  );
};

const HostGamePage: React.FC = () => (
  <PageWrapper title="Host" traceId="host-game-page">
    <HostGame />
  </PageWrapper>
);

export default HostGamePage;
