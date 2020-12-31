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
  tw`inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom bg-white rounded-lg shadow-xl`,
  tw`transition-all transform sm:my-8 sm:align-middle sm:w-full sm:p-6`,
  tw`flex items-center justify-center`,
  css`
    height: 50vh !important;
    width: 80vw !important;
  `,
]);
const LoadingIcon = styled(LoadingIconComponent)(() => [
  tw`w-32 h-32 text-black`,
]);
const QuestionText = styled.span(() => [tw`text-6xl font-bold`]);
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
