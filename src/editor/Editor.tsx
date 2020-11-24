import * as React from 'react';
import {
  useFirestore,
  useFirestoreDocData,
  useFirestoreCollectionData,
} from 'reactfire';
import { useParams } from 'react-router-dom';

import { CommonWrapper } from '../util/styled';

import { Board, Category } from './staticData';
import {
  EditorCard,
  EditorCardContainer,
  EditorCardHeader,
  EditorCardData,
  EditorGrid,
  Header,
} from './styled';

interface EditorPageParams {
  boardId?: string;
}

interface EditableCategoryCardProps {
  categoryId: string;
  categoriesQuery: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;
  name: string;
}

const EditableCategoryCard: React.FC<EditableCategoryCardProps> = ({
  categoryId,
  categoriesQuery,
  name,
}: EditableCategoryCardProps) => {
  const [inputName, setInputName] = React.useState(name);
  const category = categoriesQuery.doc(categoryId);

  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    category.set({ name: value }, { merge: true });
    setInputName(value);
  };

  return (
    <EditorCardContainer>
      <EditorCard>
        <EditorCardData onChange={onInputChange} value={inputName} />
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

  return (
    <CommonWrapper>
      <Header>{board.name}</Header>
      <EditorGrid>
        {categories.map((catData) => (
          <EditableCategoryCard
            key={catData.id}
            categoryId={catData.id || ''}
            categoriesQuery={categoriesQuery}
            name={catData.name}
          />
        ))}
      </EditorGrid>
      <pre>{JSON.stringify(board, null, 2)}</pre>
    </CommonWrapper>
  );
};

export default Editor;
