import * as React from 'react';

import PageWrapper from '../util/PageWrapper';

export const GameConfiguratorPage: React.FC = () => (
  <PageWrapper title="Boards" traceId="boards-list-page">
    <span>Game Configurator</span>
  </PageWrapper>
);

export const GamePage: React.FC = () => (
  <PageWrapper title="Board Editor" traceId="editor-page">
    <span>Game</span>
  </PageWrapper>
);

export default GameConfiguratorPage;
