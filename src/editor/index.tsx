import * as React from 'react';

import PageWrapper from '../util/PageWrapper';
import BoardsList from './BoardsList';
import Editor from './Editor';

export const BoardsListPage: React.FC = () => (
  <PageWrapper title="Boards" traceId="boards-list-page">
    <BoardsList />
  </PageWrapper>
);

export const EditorPage: React.FC = () => (
  <PageWrapper title="Board Editor" traceId="editor-page">
    <Editor />
  </PageWrapper>
);

export default BoardsListPage;
