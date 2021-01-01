import * as React from 'react';
import tw, { css, styled } from 'twin.macro';
import { useDatabase, useDatabaseListData } from 'reactfire';

import { IPlayer } from '../interfaces';

import { IconExclamation } from '.';

const Icon = styled.div(() => [tw`w-10 h-10 ml-5 text-yellow-300`]);

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

const Column = styled.div(() => [tw`flex flex-col pl-5`]);

const PlayerScore = styled.div(() => [tw`text-3xl font-extrabold`]);

const PlayerName = styled.div(() => [tw`text-xl font-light`]);

const UserAvatar = styled.img(() => [tw`w-12 ml-5 rounded-full`]);

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
            <PlayerScore>#{index + 1}</PlayerScore>
            <UserAvatar src={player.image} />
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
            {!player.connected ? (
              <Icon>
                <IconExclamation />
              </Icon>
            ) : null}
          </UserCard>
        ))}
    </SlideOut>
  );
};

export default ScoreDisplay;
