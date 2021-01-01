import * as React from 'react';
import tw, { css, styled } from 'twin.macro';
import { useAuth, useDatabase, useDatabaseObjectData } from 'reactfire';

import { ICurrentQuestion, IPlayer } from '../interfaces';
import { useAnimationFrame } from '../util/useAnimationFrame';
import { useKeyPress } from '../util/useKeyPress';

import {
  IconCheckCircle,
  IconClock,
  IconLockClosed,
  IconLockOpen,
  IconXCircle,
} from '.';
import { Card } from './Card';
import { ModalContainer } from './Modal';
import IconLoadingComponent from './IconLoading';

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

interface FullScreenCardProps {
  isWaitingForBackend: boolean;
  isAnswered: boolean;
  isCorrectAnswer: boolean;
  isInteractable: boolean;
}

const FullScreenCard = styled(Card)<FullScreenCardProps>(
  ({ isWaitingForBackend, isAnswered, isCorrectAnswer, isInteractable }) => [
    tw`overflow-hidden text-center bg-gray-800 rounded-lg shadow-xl ring-2 ring-purple-300`,
    tw`flex items-center justify-center transition-all transform`,
    isWaitingForBackend && tw`ring-gray-300`,
    isAnswered
      ? isCorrectAnswer
        ? tw`ring-green-300`
        : tw`ring-red-300`
      : null,
    isInteractable && tw`cursor-pointer hover:bg-gray-700`,
    css`
      height: 45% !important;
      width: 45% !important;
      min-height: 645px;
      min-width: 1100px;
      padding: 0 2%;
    `,
  ],
);
const LoadingIcon = styled(IconLoadingComponent)(() => [
  tw`w-32 h-32 text-purple-300`,
]);
const LoadingIconSmall = styled(IconLoadingComponent)(() => [
  tw`w-10 h-10 text-purple-300`,
]);
const QuestionText = styled.span(() => [
  tw`text-6xl font-bold`,
  css`
    line-height: 1.2em;
  `,
]);
const QuestionValue = styled.span(() => [
  tw`absolute text-4xl font-bold top-5 right-5`,
]);

const TopLeft = styled.div(() => [tw`absolute w-10 top-5 left-5`]);

const Icon = styled.div(() => [tw`w-20 h-20 cursor-pointer`]);
const RedIcon = styled(Icon)(() => [tw`text-red-500`]);
const GreenIcon = styled(Icon)(() => [tw`text-green-500`]);

const FillSpace = styled.span(() => [tw`flex-grow`]);

interface BuzzerControlsProps {
  shouldShow: boolean;
}

const BuzzerControls = styled.div<BuzzerControlsProps>(({ shouldShow }) => [
  tw`absolute w-full text-3xl font-bold transition-all`,
  tw`flex items-center justify-between px-8`,
  css`
    left: 50%;
    transform: translateX(-50%);
    bottom: -100%;
  `,
  shouldShow && tw`bottom-8`,
]);

interface TimerProps {
  timerWidth: number;
}

const Timer = styled.div<TimerProps>(({ timerWidth }) => [
  tw`absolute bottom-0 w-0 h-3 bg-red-500`,
  css`
    width: ${timerWidth}%;
  `,
]);

const unlockQuestion = (questionRef: firebase.database.Reference) => {
  questionRef.child('isUnlocked').set(true);
};

const correctAnswer = (questionRef: firebase.database.Reference) => {
  questionRef.child('isCorrect').set(true);
};

const incorrectAnswer = (questionRef: firebase.database.Reference) => {
  questionRef.child('isCorrect').set(false);
};

const buzzer = (
  questionRef: firebase.database.Reference,
  user: firebase.User | null,
) => {
  if (!user) {
    throw new Error('tried to buzz in but no user!');
  }

  questionRef.child('buzzer').set(user.uid);
};

const getInteractableFromState = (state: string, isHosting: boolean) => {
  if (isHosting) {
    if (state === 'waitingForUnlock') {
      return true;
    }

    return false;
  }

  switch (state) {
    case 'unlocked':
      return true;
    default:
      return false;
  }
};

interface QuestionModalContentsProps {
  state: string;
  question: ICurrentQuestion;
}

const QuestionModalContents = ({
  state,
  question,
}: QuestionModalContentsProps) => {
  if (state === 'noQuestion' || state === 'loading') {
    return null;
  }

  return (
    <>
      <QuestionText>{question.questionText}</QuestionText>
      <QuestionValue>${question.questionValue}</QuestionValue>
    </>
  );
};

const cardOnClick = (
  state: string,
  isHosting: boolean,
  questionRef: firebase.database.Reference,
  user: firebase.User | null,
) => {
  if (!isHosting && state === 'unlocked') {
    buzzer(questionRef, user);
  }

  if (isHosting) {
    switch (state) {
      case 'waitingForUnlock':
        unlockQuestion(questionRef);
      default:
        return;
    }
  }
};

interface CurrentQuestionModalProps {
  gameId: string;
  isHosting: boolean;
}

export const CurrentQuestionModal: React.FC<CurrentQuestionModalProps> = ({
  gameId,
  isHosting,
}: CurrentQuestionModalProps) => {
  const [currentState, setCurrentState] = React.useState('noQuestion');
  const isSpacePressed = useKeyPress('Space');
  const [showModal, setShowModal] = React.useState(false);
  const database = useDatabase();
  const { currentUser } = useAuth();
  const [timerWidth, setTimerWidth] = React.useState(0);
  const [buzzerUser, setBuzzerUser] = React.useState('');

  const currentQuestionRef = database.ref(`/games/${gameId}/currentQuestion`);
  const currentQuestion = useDatabaseObjectData<ICurrentQuestion>(
    currentQuestionRef,
  );

  const playersRef = database.ref(`/games/${gameId}/players`);

  useAnimationFrame(() => {
    let startTime = 0;
    let totalTime = 0;

    switch (currentState) {
      case 'unlocked':
        startTime = currentQuestion.unlockedAt;
        totalTime = 5000;
        break;
      case 'buzzed':
        startTime = currentQuestion.buzzedAt;
        totalTime = 3000;
        break;
      default:
        return; // just end early
    }

    const rawTimeValue = Date.now() - startTime;
    const timeLeft = totalTime - rawTimeValue;
    const timerWidth = Math.max((timeLeft / totalTime) * 100, 0);

    setTimerWidth(timerWidth);

    if (timeLeft <= 0) {
      if (isHosting && currentState === 'unlocked') {
        currentQuestionRef.child('isDead').set(true);
      }
    }
  }, [currentState]);

  React.useEffect(() => {
    if (isSpacePressed) {
      cardOnClick(currentState, isHosting, currentQuestionRef, currentUser);
    }
  }, [isSpacePressed]);

  React.useEffect(() => {
    if (!currentQuestion.questionId) {
      setCurrentState('noQuestion');
    }

    if (currentQuestion.questionId && !currentQuestion.createdAt) {
      setCurrentState('loading');
    }

    if (currentQuestion.createdAt) {
      setCurrentState('waitingForUnlock');
    }

    if (currentQuestion.isUnlocked && !currentQuestion.unlockedAt) {
      setCurrentState('waitingForBackend');
    }

    if (currentQuestion.isUnlocked && currentQuestion.unlockedAt) {
      setCurrentState('unlocked');
    }

    if (currentQuestion.buzzer && !currentQuestion.buzzedAt) {
      setCurrentState('waitingForBackend');
    }

    if (currentQuestion.buzzer && currentQuestion.buzzedAt) {
      setCurrentState('buzzed');
    }

    if (currentQuestion.isDead) {
      setCurrentState('dead');
    }

    if (currentQuestion.isCorrect !== undefined) {
      if (currentQuestion.isCorrect) {
        setCurrentState('correctAnswer');
      } else {
        setCurrentState('incorrectAnswer');
      }
    }
  }, [currentQuestion]);

  React.useEffect(() => {
    switch (currentState) {
      case 'noQuestion':
        return setShowModal(false);
      default:
        return setShowModal(true);
    }
  }, [currentState]);

  React.useEffect(() => {
    if (!currentQuestion.buzzer) {
      return;
    }

    if (currentState === 'buzzed') {
      const buzzerPlayerRef = playersRef.child(currentQuestion.buzzer);

      buzzerPlayerRef
        .once('value')
        .then((playerSnapshot) => playerSnapshot.val())
        .then((playerVal: IPlayer) => {
          setBuzzerUser(playerVal.name);
        });
    }
  }, [currentQuestion, currentState]);

  return (
    <ModalContainer showModal={showModal}>
      <Wrapper>
        <InnerWrapper>
          <BackgroundWrapper className={`${showModal ? 'blur' : ''}`}>
            <Background />
          </BackgroundWrapper>
          <FullScreenCard
            onClick={() =>
              cardOnClick(
                currentState,
                isHosting,
                currentQuestionRef,
                currentUser,
              )
            }
            isWaitingForBackend={
              currentState === 'waitingForBackend' || currentState === 'loading'
            }
            isAnswered={
              currentQuestion.isCorrect !== undefined || currentQuestion.isDead
            }
            isCorrectAnswer={currentState === 'correctAnswer'}
            isInteractable={getInteractableFromState(currentState, isHosting)}
          >
            {currentState === 'noQuestion' || currentState === 'loading' ? (
              <LoadingIcon />
            ) : null}

            <QuestionModalContents
              question={currentQuestion}
              state={currentState}
            />

            {currentState === 'unlocked' || currentState === 'buzzed' ? (
              <Timer timerWidth={timerWidth} />
            ) : null}

            <TopLeft>
              {currentState === 'waitingForUnlock' ? <IconLockClosed /> : null}
              {currentState === 'unlocked' ? <IconLockOpen /> : null}
              {currentState === 'buzzed' ? <IconClock /> : null}
              {currentState === 'waitingForBackend' ? (
                <LoadingIconSmall />
              ) : null}
            </TopLeft>

            <BuzzerControls shouldShow={currentState === 'buzzed'}>
              {isHosting ? (
                <span>
                  <GreenIcon onClick={() => correctAnswer(currentQuestionRef)}>
                    <IconCheckCircle />
                  </GreenIcon>
                </span>
              ) : null}
              <FillSpace>{buzzerUser}</FillSpace>
              {isHosting ? (
                <span>
                  <RedIcon onClick={() => incorrectAnswer(currentQuestionRef)}>
                    <IconXCircle />
                  </RedIcon>
                </span>
              ) : null}
            </BuzzerControls>
          </FullScreenCard>
        </InnerWrapper>
      </Wrapper>
    </ModalContainer>
  );
};

export default CurrentQuestionModal;
