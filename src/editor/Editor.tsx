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
  PageWrapper,
} from '../components';
import { IBoard, ICategory, IQuestion } from '../interfaces';

import { QuestionCategory, QuestionValue } from './styled';

interface EditorPageParams {
  boardId?: string;
}

interface EditableCardProps {
  field: string;
  id: string;
  initialValue: string;
  query: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;
  textField: string;
}

const EditableCard: React.FC<EditableCardProps> = ({
  field,
  id,
  initialValue,
  query,
  textField,
}: EditableCardProps) => {
  const [inputValue, setInputValue] = React.useState(initialValue);
  const doc = query.doc(id);

  React.useEffect(() => {
    const onSnap = doc.onSnapshot((snap) => {
      const data = snap.data();
      if (data && data[textField]) {
        setInputValue(data[textField]);
      }
    });

    return () => onSnap();
  }, [doc]);

  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    doc.set({ [field]: value }, { merge: true });
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
              textField="name"
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
                textField="question"
              />
              <QuestionValue>
                {qData.value.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </QuestionValue>
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
