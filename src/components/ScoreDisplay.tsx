import * as React from 'react';
import tw, { css, styled } from 'twin.macro';
import { useDatabase, useDatabaseListData } from 'reactfire';

import { IPlayer } from '../interfaces';

import { IconExclamation } from '.';

const IconContainer = styled.div(() => [
  tw`absolute inset-0 bg-black bg-opacity-70`,
]);

const Icon = styled.div(() => [
  tw`absolute w-10/12 text-yellow-400`,
  css`
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `,
]);

interface SlideOutProps {
  isOpen: boolean;
}

const SlideOut = styled.div<SlideOutProps>(({ isOpen }) => [
  tw`fixed top-0 bottom-0 transition-all bg-gray-500 cursor-pointer pointer-events-auto w-96`,
  tw`shadow-xl`,
  css`
    user-select: none;
    right: -24rem;
    z-index: 100;
  `,
  isOpen && tw`right-0`,
]);

const Control = styled.div(() => [
  tw`flex items-center justify-center cursor-pointer pointer-events-auto`,
  tw`absolute w-32 h-10 text-2xl font-semibold bg-gray-500 rounded-t-lg`,
  css`
    transform: rotate(-90deg) translate(0, -50%);
    top: 50%;
    right: 20rem;
  `,
]);

const UserCard = styled.div(() => [
  tw`pb-5 pl-5 m-5 overflow-hidden border-0 border-b-2 border-gray-300`,
  tw`flex items-center justify-start`,
]);

const Column = styled.div(() => [
  tw`flex flex-col pl-5`,
  css`
    width: 65%;
  `,
]);

const PlayerScore = styled.div(() => [tw`text-3xl font-extrabold`]);

const ScorePlace = styled.div(() => [
  tw`text-3xl font-extrabold`,
  css`
    width: 2.5rem;
  `,
]);

const PlayerName = styled.div(() => [
  tw`text-xl font-light`,
  css`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  `,
]);

interface UserAvatarContainerProps {
  isDisconnected: boolean;
}

const UserAvatarContainer = styled.div<UserAvatarContainerProps>(
  ({ isDisconnected }) => [
    tw`relative flex items-center justify-center w-12 ml-5 overflow-hidden rounded-full`,
    isDisconnected && tw`ring-red-600 ring`,
  ],
);

interface ScoreDisplayProps {
  gameId: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  gameId,
}: ScoreDisplayProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const database = useDatabase();
  const playersRef = database.ref(`/games/${gameId}/players`);
  const players = useDatabaseListData<IPlayer>(playersRef);

  return (
    <SlideOut isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
      <Control onClick={() => setIsOpen(!isOpen)}>Scores</Control>
      {players
        .sort((a, b) => b.currentScore - a.currentScore)
        .map((player, index) => (
          <UserCard key={player.id}>
            <ScorePlace>#{index + 1}</ScorePlace>
            <UserAvatarContainer isDisconnected={!player.connected}>
              {!player.connected ? (
                <IconContainer>
                  <Icon>
                    <IconExclamation />
                  </Icon>
                </IconContainer>
              ) : null}
              <img src={player.image} />
            </UserAvatarContainer>
            <Column>
              <PlayerScore>
                {player.currentScore?.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </PlayerScore>
              <PlayerName>{player.name}</PlayerName>
            </Column>
          </UserCard>
        ))}
    </SlideOut>
  );
};

export default ScoreDisplay;
