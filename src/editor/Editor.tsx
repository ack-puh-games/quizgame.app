import * as React from 'react';
import {
  useFirestore,
  useFirestoreDocData,
  useFirestoreCollectionData,
} from 'reactfire';
import { useParams } from 'react-router-dom';

import {
  CardGrid,
  CardWrapper,
  CardContainer,
  CardEditableData,
  CommonWrapper,
  EditorCard,
  Header,
} from '../components';
import { IBoard, ICategory, IQuestion } from '../interfaces';
import PageWrapper from '../util/PageWrapper';

import { QuestionCategory, QuestionValue } from './styled';

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
    <CardContainer>
      <EditorCard>
        <CardEditableData onChange={onInputChange} value={inputValue} />
      </EditorCard>
    </CardContainer>
  );
};

const Editor: React.FC = () => {
  const { boardId } = useParams<EditorPageParams>();
  const firestore = useFirestore();

  const boardQuery = firestore.collection('boards').doc(boardId);

  const board = useFirestoreDocData<IBoard>(boardQuery);

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

  return (
    <CommonWrapper>
      <Header>{board.name}</Header>
      <CardGrid>
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
      </CardGrid>
    </CommonWrapper>
  );
};

const EditorPage: React.FC = () => (
  <PageWrapper title="Board Editor" traceId="editor-page">
    <Editor />
  </PageWrapper>
);

export default EditorPage;
