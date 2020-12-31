import * as React from 'react';
import tw, { css, styled } from 'twin.macro';
import { useAuth, useDatabase, useDatabaseObjectData } from 'reactfire';

import { ICurrentQuestion } from '../interfaces';

import { Card } from './Card';
import { ModalContainer } from './Modal';
import LoadingIconComponent from './LoadingIcon';

const Wrapper = styled.div(() => [
  tw`fixed inset-0 z-10 flex items-center justify-center overflow-hidden`,
]);
const InnerWrapper = styled.div(() => [
  tw`flex items-center justify-center h-full px-4 pt-4 pb-20 text-center sm:p-0`,
]);
const BackgroundWrapper = styled.div(() => [
  tw`fixed inset-0 transition-opacity`,
]);
const Background = styled.div(() => [tw`absolute inset-0 bg-black opacity-25`]);
const FullScreenCard = styled(Card)(() => [
  tw`overflow-hidden text-center bg-gray-800 rounded-lg shadow-xl ring-2 ring-purple-300`,
  tw`flex items-center justify-center transition-all transform`,
  css`
    height: 45% !important;
    width: 45% !important;
    min-height: 645px;
    min-width: 1100px;
    padding: 0 2%;
  `,
]);
const LoadingIcon = styled(LoadingIconComponent)(() => [
  tw`w-32 h-32 text-purple-300`,
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
const BottomLeft = styled.div(() => [tw`absolute bottom-5 left-5`]);

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

interface HostButtonsProps {
  state: string;
  questionRef: firebase.database.Reference;
}

const HostButtons = ({ state, questionRef }: HostButtonsProps) => {
  return (
    <BottomLeft>
      <button onClick={() => unlockQuestion(questionRef)}>Unlock!</button>
      <button onClick={() => correctAnswer(questionRef)}>Correct!</button>
      <button onClick={() => incorrectAnswer(questionRef)}>Incorrect!</button>
    </BottomLeft>
  );
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
  const [showModal, setShowModal] = React.useState(false);
  const database = useDatabase();
  const { currentUser } = useAuth();

  const currentQuestionRef = database.ref(`/games/${gameId}/currentQuestion`);
  const currentQuestion = useDatabaseObjectData<ICurrentQuestion>(
    currentQuestionRef,
  );

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

    if (currentQuestion.isUnlocked && currentQuestion.unlockedAt) {
      setCurrentState('unlocked');
    }

    if (currentQuestion.buzzer) {
      setCurrentState('buzzed');
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

  return (
    <>
      <ModalContainer showModal={showModal}>
        <Wrapper>
          <InnerWrapper>
            <BackgroundWrapper>
              <Background />
            </BackgroundWrapper>
            <FullScreenCard>
              {currentState === 'noQuestion' || currentState === 'loading' ? (
                <LoadingIcon />
              ) : null}

              <QuestionModalContents
                question={currentQuestion}
                state={currentState}
              />

              {isHosting ? (
                <HostButtons
                  state={currentState}
                  questionRef={currentQuestionRef}
                />
              ) : null}

              {!isHosting && currentState === 'unlocked' ? (
                <BottomLeft>
                  <button
                    onClick={() => buzzer(currentQuestionRef, currentUser)}
                  >
                    Buzzer
                  </button>
                </BottomLeft>
              ) : null}
            </FullScreenCard>
          </InnerWrapper>
        </Wrapper>
      </ModalContainer>
    </>
  );
};

export default CurrentQuestionModal;
