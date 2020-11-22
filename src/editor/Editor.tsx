import * as React from 'react';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { useParams } from 'react-router-dom';

import { CommonWrapper } from '../util/styled';

import { Board } from './staticData';
import { Header } from './styled';

interface EditorPageParams {
  boardId?: string;
}

const Editor: React.FC = () => {
  const { boardId } = useParams<EditorPageParams>();
  const firestore = useFirestore();

  const boardQuery = firestore.collection('boards').doc(boardId);

  const board = useFirestoreDocData<Board>(boardQuery);

  return (
    <CommonWrapper>
      <Header>{board.name}</Header>
      <pre>{JSON.stringify(board.boardData, null, 2)}</pre>
    </CommonWrapper>
  );
};

export default Editor;
