import * as React from 'react';
import { Link } from 'react-router-dom';
import tw, { css, styled } from 'twin.macro';

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

export const CardsContainer = styled.div(() => [
  tw`flex flex-row flex-wrap mt-8`,
]);

export const BoardCardContainer = styled(Link)(() => [tw`w-64 h-32 m-2`]);

export const BoardCard = styled.div(() => [
  tw`flex flex-row p-4 bg-white rounded shadow-sm`,
  tw`w-full h-full cursor-pointer hover:bg-gray-100`,
]);

export const BoardIconContainer = styled.div(() => [
  tw`flex items-center justify-center flex-shrink-0 w-12 h-12`,
  tw`text-blue-100 bg-gradient-to-br from-blue-300 to-indigo-700 rounded-xl`,
]);

export const BoardIcon = styled(BoardIconComponent)(() => [tw`w-8 h-8`]);

export const BoardFlexColumn = styled.div(() => [
  tw`flex flex-col flex-grow ml-4`,
]);

export const BoardCardHeader = styled.span(() => [tw`text-sm text-gray-500`]);

export const BoardCardData = styled.span(() => [
  tw`w-32 text-lg font-bold`,
  css`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  `,
]);

export const EmptyBoardCardContainer = styled.div(() => [
  tw`flex w-64 h-32 m-2 rounded-lg cursor-pointer hover:shadow-lg`,
]);

export const EmptyBoardCard = styled.div(() => [
  tw`flex items-center justify-center w-full py-4 text-lg`,
  tw`font-medium border-2 border-gray-500 border-dashed rounded-lg`,
  tw`hover:border-transparent hover:shadow-xs`,
  tw`transition-all duration-150 ease-in-out`,
]);

export const EditorGrid = styled.div(() => [
  css`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(6, 1fr);
    gap: 5px 5px;
    grid-template-areas:
      '. . . . . .'
      '. . . . . .'
      '. . . . . .'
      '. . . . . .'
      '. . . . . .'
      '. . . . . .';
  `,
]);

export const EditorCardContainer = styled.div(() => [tw`w-64 h-32 m-2`]);

export const EditorCard = styled.div(() => [
  tw`flex flex-row p-4 bg-white rounded shadow-sm`,
  tw`w-full h-full`,
  tw`items-center justify-center`,
]);

export const EditorCardHeader = styled.span(() => [tw`text-sm text-gray-500`]);

export const EditorCardData = styled.textarea(() => [
  tw`w-full h-full text-lg font-bold`,
  css`
    white-space: normal;
    text-align: justify;
    text-align-last: center;
    resize: none;
  `,
]);
