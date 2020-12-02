import * as React from 'react';
import {
  useDatabase,
  useDatabaseObjectData,
  useDatabaseListData,
  useFirestore,
  useFirestoreCollectionData,
} from 'reactfire';
import { useParams } from 'react-router-dom';

import {
  Card,
  CardContainer,
  CardData,
  CardGrid,
  CardWrapper,
  CommonWrapper,
} from '../components';
import { ICategory, IGame, IQuestion } from '../interfaces';
import PageWrapper from '../util/PageWrapper';

interface GamePageParams {
  gameId?: string;
}

interface IUserVisibleQuestion {
  id?: string;
  categoryId: string;
  value: number;
}

const PlayGame: React.FC = () => {
  const { gameId } = useParams<GamePageParams>();
  const database = useDatabase();
  const firestore = useFirestore();

  const gameDataRef = database.ref(`/games/${gameId}`);
  const gameData = useDatabaseObjectData<IGame>(gameDataRef);

  const boardQuery = firestore.collection('boards').doc(gameData.board);

  const categoriesQuery = boardQuery.collection('categories');

  const categories = useFirestoreCollectionData<ICategory>(
    categoriesQuery.orderBy('pos'),
    {
      idField: 'id',
    },
  );

  const questionsRef = database.ref(`/games/${gameId}/questions`);

  const questions = useDatabaseListData<IUserVisibleQuestion>(questionsRef);

  const catQuestionMap = categories.map((catData) => ({
    ...catData,
    questions: questions
      .filter((q) => q.categoryId === catData.id)
      .sort((a, b) => a.value - b.value)
      .map((qData) => ({
        ...qData,
        categoryId: catData.id,
        // CSS grid is 1-indexed, plus an extra 1 to account for the category row.
        index: qData.value / 200 + 1,
      })),
  }));

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
