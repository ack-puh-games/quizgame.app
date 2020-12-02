import * as React from 'react';
import * as firebase from 'firebase/app';
import {
  useDatabase,
  useDatabaseObjectData,
  useFirestore,
  useFirestoreCollectionData,
  useUser,
} from 'reactfire';
import { useParams } from 'react-router-dom';

import {
  Card,
  CardContainer,
  CardData,
  CardGrid,
  CardWrapper,
  CommonWrapper,
  PageWrapper,
} from '../components';
import { ICategory, IGame, IQuestion } from '../interfaces';

interface GamePageParams {
  gameId?: string;
}

const HostGame: React.FC = () => {
  const user = useUser<firebase.User>();
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

  const questionsQuery = boardQuery.collection('questions');

  const questions = useFirestoreCollectionData<IQuestion>(
    questionsQuery.orderBy('value'),
    { idField: 'id' },
  );

  const catQuestionMap = categories.map((catData) => ({
    ...catData,
    questions: questions.filter((qData) => qData.categoryId === catData.id),
  }));

  const selectQuestion = (
    questionId: string,
    categoryId: string,
    index: number,
  ) => {
    gameDataRef.child('selectedQuestions').push({
      categoryId,
      index,
    });
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
              onClick={() =>
                selectQuestion(qData.id || '', catData.id || '', index)
              }
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
    </CommonWrapper>
  );
};

const HostGamePage: React.FC = () => (
  <PageWrapper title="Host" traceId="host-game-page">
    <HostGame />
  </PageWrapper>
);

export default HostGamePage;
