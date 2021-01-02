import * as React from 'react';
import tw, { css, styled } from 'twin.macro';
import {
  useDatabase,
  useDatabaseListData,
  useDatabaseObjectData,
} from 'reactfire';

import { IPlayer } from '../interfaces';

import { IconTrophy } from '.';
import { Card } from './Card';
import { ModalContainer } from './Modal';

const Wrapper = styled.div(() => [
  tw`fixed inset-0 z-10 flex items-center justify-center overflow-hidden`,
]);
const InnerWrapper = styled.div(() => [
  tw`flex items-center justify-center h-full px-4 pt-4 pb-20 text-center sm:p-0`,
]);

const BackgroundWrapper = styled.div(() => [
  tw`fixed inset-0`,
  css`
    transition: 0.4s backdrop-filter ease-in-out;
    backdrop-filter: blur(0px);

    &.blur {
      backdrop-filter: blur(4px);
    }
  `,
]);
const Background = styled.div(() => [tw`absolute inset-0 bg-black opacity-25`]);

const IconWrapper = styled.div(() => [
  tw`flex items-center justify-center`,
  css`
    min-width: 5rem;
  `,
]);
const GoldTrophy = styled.div(() => [tw`w-20 h-20 text-yellow-400`]);
const SilverTrophy = styled.div(() => [tw`w-16 h-16 text-gray-300`]);
const BronzeTrophy = styled.div(() => [tw`w-12 h-12 text-amber-600`]);

const Header = styled.div(() => [tw`mb-20 text-6xl font-bold`]);

const WinnerRow = styled.div(() => [
  tw`flex items-center justify-between px-8 py-8 overflow-hidden`,
  css`
    width: 80%;
  `,
]);

const PlayerRow = styled.div(() => [
  tw`flex items-center justify-start flex-grow pl-10`,
]);
const UserAvatar = styled.img(() => [tw`w-16 mr-10 rounded-full`]);
const PlayerName = styled.div(() => [
  tw`text-3xl font-semibold text-left w-80`,
  css`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  `,
]);
const PlayerScore = styled.div(() => [
  tw`flex items-center justify-end w-48 text-5xl font-extrabold`,
]);

const FullScreenCard = styled(Card)(() => [
  tw`overflow-hidden text-center bg-gray-800 rounded-lg shadow-xl ring-2 ring-green-300`,
  tw`flex flex-col items-center justify-center transition-all transform`,
  css`
    height: 45% !important;
    width: 45% !important;
    min-height: 645px;
    min-width: 1100px;
    padding: 0 2%;
  `,
]);

interface GameCompleteModalProps {
  gameId: string;
}

export const GameCompleteModal: React.FC<GameCompleteModalProps> = ({
  gameId,
}: GameCompleteModalProps) => {
  const [showModal, setShowModal] = React.useState(false);
  const database = useDatabase();

  const createdAtRef = database.ref(`/games/${gameId}/createdAt`);
  const playersRef = database.ref(`/games/${gameId}/players`);
  const questionsRef = database.ref(`/games/${gameId}/questions`);
  const currentQuestionRef = database.ref(`/games/${gameId}/currentQuestion`);

  const createdAt = useDatabaseObjectData<number>(createdAtRef);
  const players = useDatabaseListData<IPlayer>(playersRef);
  const questions = useDatabaseListData<any>(questionsRef);
  const currentQuestion = useDatabaseObjectData<any>(currentQuestionRef);

  const topThreePlayers = players
    .sort((a, b) => b.currentScore - a.currentScore)
    .slice(0, 3);

  const trophies = [GoldTrophy, SilverTrophy, BronzeTrophy];

  React.useEffect(() => {
    // assume the game can't end in the first 10 seconds.
    // this is because technically the questions list will be empty when the game starts,
    // until the cloud function to create the questions list runs.
    if (
      Date.now() - createdAt >= 10000 &&
      questions.length === 0 &&
      currentQuestion.questionId === undefined
    ) {
      setShowModal(true);
    }
  }, [createdAt, questions]);

  return (
    <ModalContainer showModal={showModal}>
      <Wrapper>
        <InnerWrapper>
          <BackgroundWrapper className={`${showModal ? 'blur' : ''}`}>
            <Background />
          </BackgroundWrapper>
          <FullScreenCard>
            <Header>Game Finished!</Header>
            {topThreePlayers.map((player, index) => {
              const TrophyColor = trophies[index] || React.Fragment;
              return (
                <WinnerRow key={player.id}>
                  <IconWrapper>
                    <TrophyColor>
                      <IconTrophy />
                    </TrophyColor>
                  </IconWrapper>
                  <PlayerRow>
                    <UserAvatar src={player.image} />
                    <PlayerName>{player.name}</PlayerName>
                  </PlayerRow>
                  <PlayerScore>
                    {player.currentScore?.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </PlayerScore>
                </WinnerRow>
              );
            })}
          </FullScreenCard>
        </InnerWrapper>
      </Wrapper>
    </ModalContainer>
  );
};

export default GameCompleteModal;
