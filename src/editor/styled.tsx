import * as React from 'react';
import { Link } from 'react-router-dom';
import tw, { styled } from 'twin.macro';

import {
  Button,
  EmptyImage as EmptyImageComponent,
  Modal,
} from '../components';

import { default as BoardIconComponent } from './BoardIcon';

export const EmptyImage = styled(EmptyImageComponent)(() => [
  tw`w-full max-w-lg my-8`,
]);

export const Header = styled.span(() => [
  tw`mb-8 font-sans text-2xl font-bold`,
]);

export const ModalFormLabel = styled.label(() => [tw`block`]);

export const ModalFormLabelText = styled.span(() => [
  tw`text-sm font-medium text-gray-700`,
]);

export const ModalFormInputWrapper = styled.div(() => [
  tw`relative mt-1 rounded-md shadow-sm`,
]);

export const ModalFormInput = styled.input(() => [
  tw`block w-full mt-1 form-input`,
]);

interface CreateBoardModalProps {
  closeModal: () => void;
  createBoard: () => void;
  newBoardName: string;
  setNewBoardName: React.Dispatch<React.SetStateAction<string>>;
  showCreationModal: boolean;
}

export const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
  closeModal,
  createBoard,
  newBoardName,
  setNewBoardName,
  showCreationModal,
}: CreateBoardModalProps) => (
  <Modal
    title="Create a Board"
    footer={
      <Button onClick={createBoard} fullWidth>
        Create
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

export const ActionsContainer = styled.div(() => [
  tw`flex flex-row justify-end w-4/5`,
]);

export const CardsContainer = styled.div(() => [
  tw`grid grid-cols-12 gap-4 mt-8`,
]);

export const BoardCardContainer = styled(Link)(() => [
  tw`col-span-12 sm:col-span-6 md:col-span-3`,
]);

export const BoardCard = styled.div(() => [
  tw`flex flex-row p-4 bg-white rounded shadow-sm`,
  tw`cursor-pointer hover:bg-gray-100`,
]);

export const BoardIconContainer = styled.div(() => [
  tw`flex items-center justify-center flex-shrink-0 w-12 h-12 text-blue-600 bg-blue-200 rounded-xl`,
]);

export const BoardIcon = styled(BoardIconComponent)(() => [tw`w-6 h-6`]);

export const BoardFlexColumn = styled.div(() => [
  tw`flex flex-col flex-grow ml-4`,
]);

export const BoardCardHeader = styled.span(() => [tw`text-sm text-gray-500`]);

export const BoardCardData = styled.span(() => [tw`text-lg font-bold`]);
