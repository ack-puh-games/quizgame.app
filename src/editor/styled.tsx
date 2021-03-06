import * as React from 'react';
import tw, { css, styled } from 'twin.macro';

import {
  Button,
  EmptyImage as EmptyImageComponent,
  IconLoading,
  Modal,
} from '../components';

export const EmptyImage = styled(EmptyImageComponent)(() => [
  tw`w-full max-w-lg my-8`,
]);

export const ModalFormLabel = styled.label(() => [tw`block`]);

export const ModalFormLabelText = styled.span(() => [
  tw`text-sm font-medium text-gray-200`,
]);

export const ModalFormInputWrapper = styled.div(() => [tw`relative mt-1`]);

export const ModalFormInput = styled.input(() => [
  tw`block w-full px-3 py-2 border-0 rounded-md shadow-sm`,
  tw`focus:outline-none! focus:ring-purple-300`,
  tw`text-gray-200 bg-gray-600`,
]);

interface CreateBoardModalProps {
  closeModal: () => void;
  createBoard: () => void;
  newBoardName: string;
  setNewBoardName: React.Dispatch<React.SetStateAction<string>>;
  showCreationModal: boolean;
  isCreatingBoard: boolean;
}

export const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
  closeModal,
  createBoard,
  newBoardName,
  setNewBoardName,
  showCreationModal,
  isCreatingBoard,
}: CreateBoardModalProps) => (
  <Modal
    title="Create a Board"
    footer={
      <Button onClick={createBoard} disabled={isCreatingBoard} fullWidth>
        {isCreatingBoard ? <IconLoading /> : 'Create'}
      </Button>
    }
    onClose={closeModal}
    showModal={showCreationModal}
    key="create-board-modal"
  >
    <ModalFormLabel htmlFor="name">
      <ModalFormLabelText>Name your Board</ModalFormLabelText>
      <ModalFormInputWrapper>
        <ModalFormInput
          type="text"
          id="name"
          placeholder="My Board"
          value={newBoardName}
          onChange={(e) => {
            e.persist();
            setNewBoardName(e.target.value);
          }}
        />
      </ModalFormInputWrapper>
    </ModalFormLabel>
  </Modal>
);

export const EmptyBoardCardContainer = styled.div(() => [
  tw`flex w-64 h-32 m-2 rounded-lg cursor-pointer hover:shadow-lg`,
]);

export const EmptyBoardCard = styled.div(() => [
  tw`flex items-center justify-center w-full py-4 text-lg`,
  tw`font-medium border-2 border-gray-500 border-dashed rounded-lg`,
  tw`hover:border-transparent hover:shadow`,
  tw`transition-all duration-150 ease-in-out`,
  tw`hocus:(ring-purple-300 ring-2)`,
]);

export const ExtraDataField = styled.div(() => [
  tw`absolute text-xs font-semibold`,
]);

export const QuestionValue = styled(ExtraDataField)(() => [
  css`
    bottom: 12px;
    left: 15px;
  `,
]);

export const QuestionCategory = styled(ExtraDataField)(() => [
  css`
    bottom: 12px;
    right: 15px;
  `,
]);
