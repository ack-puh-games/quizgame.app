import * as React from 'react';
import { useDatabase, useDatabaseObjectData } from 'reactfire';
import { useParams, useHistory } from 'react-router-dom';

import {
  Card,
  CardContainer,
  CardData,
  CardGrid,
  CardWrapper,
  CommonWrapper,
  PageWrapper,
} from '../components';
import { IGame } from '../interfaces';
import { useBoardData } from './useBoardData';

interface GamePageParams {
  gameId?: string;
}

const PlayGame: React.FC = () => {
  const history = useHistory();
  const { gameId } = useParams<GamePageParams>();
  const database = useDatabase();

  const gameDataRef = database.ref(`/games/${gameId}`);
  const gameData = useDatabaseObjectData<IGame>(gameDataRef);

  if (!gameData.board || !gameId) {
    history.push('/');
  }

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
                  <CardData isLargeText>${qData.value}</CardData>
                </Card>
              </CardContainer>
            </CardWrapper>
          )),
        )}
      </CardGrid>
    </CommonWrapper>
  );
};

const PlayGamePage: React.FC = () => (
  <PageWrapper title="Play" traceId="play-game-page">
    <PlayGame />
  </PageWrapper>
);

export default PlayGamePage;
