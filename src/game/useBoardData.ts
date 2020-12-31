import {
  useDatabase,
  useDatabaseObjectData,
  useDatabaseListData,
  useFirestore,
  useFirestoreCollectionData,
} from 'reactfire';

import { ICategory, IGame, IUserVisibleQuestion } from '../interfaces';

interface ICategoryQuestionMap extends ICategory {
  questions: IUserVisibleQuestion[];
}

interface BoardData {
  categories: ICategory[];
  catQuestionMap: ICategoryQuestionMap[];
}

interface BoardDataProps {
  gameId?: string;
  board?: string;
}

export const useBoardData = ({ gameId, board }: BoardDataProps): BoardData => {
  const database = useDatabase();
  const firestore = useFirestore();

  const boardQuery = firestore.collection('boards').doc(board);

  const categoriesQuery = boardQuery.collection('categories');

  const categories = useFirestoreCollectionData<ICategory>(
    categoriesQuery.orderBy('pos'),
    {
      idField: 'id',
    },
  );

  const questionsRef = database.ref(`/games/${gameId}/questions`);

  const questions = useDatabaseListData<IUserVisibleQuestion>(questionsRef, {
    idField: 'id',
  });

  const catQuestionMap: ICategoryQuestionMap[] = categories.map((catData) => ({
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

  return { categories, catQuestionMap };
};
