import * as React from 'react';
import {
  useFirestore,
  useFirestoreDocData,
  useFirestoreCollectionData,
} from 'reactfire';
import { useParams } from 'react-router-dom';

import { CommonWrapper } from '../util/styled';

import { Board, Category, Question } from './staticData';
import {
  CardWrapper,
  EditorCard,
  EditorCardContainer,
  EditorCardData,
  EditorGrid,
  Header,
  QuestionCategory,
  QuestionValue,
} from './styled';

interface EditorPageParams {
  boardId?: string;
}

interface EditableCardProps {
  field: string;
  id: string;
  initialValue: string;
  query: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;
}

const EditableCard: React.FC<EditableCardProps> = ({
  field,
  id,
  initialValue,
  query,
}: EditableCardProps) => {
  const [inputValue, setInputValue] = React.useState(initialValue);
  const doc = query.doc(id);

  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    doc.set({ [field]: value, edited: true }, { merge: true });
    setInputValue(value);
  };

  return (
    <EditorCardContainer>
      <EditorCard>
        <EditorCardData onChange={onInputChange} value={inputValue} />
      </EditorCard>
    </EditorCardContainer>
  );
};

const Editor: React.FC = () => {
  const { boardId } = useParams<EditorPageParams>();
  const firestore = useFirestore();

  const boardQuery = firestore.collection('boards').doc(boardId);

  const board = useFirestoreDocData<Board>(boardQuery);

  const categoriesQuery = boardQuery.collection('categories');

  const categories = useFirestoreCollectionData<Category>(
    categoriesQuery.orderBy('pos'),
    {
      idField: 'id',
    },
  );

  const questionsQuery = boardQuery.collection('questions');

  const questions = useFirestoreCollectionData<Question>(
    questionsQuery.orderBy('value'),
    { idField: 'id' },
  );

  const catQuestionMap = categories.map((catData) => ({
    ...catData,
    questions: questions.filter((qData) => qData.categoryId === catData.id),
  }));

  console.log(catQuestionMap);

  return (
    <CommonWrapper>
      <Header>{board.name}</Header>
      <EditorGrid>
        {categories.map((catData) => (
          <CardWrapper key={catData.id} posX={catData.pos} posY={1}>
            <EditableCard
              field="name"
              id={catData.id || ''}
              initialValue={catData.name}
              query={categoriesQuery}
            />
          </CardWrapper>
        ))}
        {catQuestionMap.map((catData) =>
          catData.questions.map((qData) => (
            <CardWrapper
              key={qData.id}
              posX={catData.pos}
              posY={qData.value / 200 + 1}
            >
              <EditableCard
                field="question"
                id={qData.id || ''}
                initialValue={qData.question}
                query={questionsQuery}
              />
              <QuestionValue>${qData.value}</QuestionValue>
              <QuestionCategory>{catData.name}</QuestionCategory>
            </CardWrapper>
          )),
        )}
      </EditorGrid>
    </CommonWrapper>
  );
};

export default Editor;
