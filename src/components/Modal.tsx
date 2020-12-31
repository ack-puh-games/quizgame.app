import * as React from 'react';
import tw, { css, styled } from 'twin.macro';

type ModalSize = 'small' | 'medium' | 'large';

interface ModalComponentProps {
  title: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  showModal: boolean;
  onClose: () => void;
  size?: ModalSize;
}

interface ModalBodyProps {
  hasFooter?: boolean;
}

interface ModalContentWrapperProps {
  size: ModalSize;
}

interface ModalContainerProps {
  showModal: boolean;
}

export const ModalBackground = styled.div(() => [
  tw`fixed inset-0 z-10 bg-black opacity-25`,
]);

export const ModalContainer = styled.div<ModalContainerProps>(
  ({ showModal }) => [
    tw`flex items-center justify-center`,
    tw`overflow-x-hidden overflow-y-auto`,
    tw`fixed inset-0 z-50 outline-none focus:outline-none`,
    tw`transition duration-200 ease-in-out`,
    !showModal && tw`opacity-0 pointer-events-none`,
  ],
);

const ModalContentWrapper = styled.div<ModalContentWrapperProps>(({ size }) => [
  tw`relative z-50 w-auto mx-auto my-6`,
  size === 'small' && tw`max-w-sm`,
  size === 'medium' && tw`max-w-md`,
  size === 'large' && tw`max-w-lg`,
]);

const ModalContent = styled.div(() => [
  tw`relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none`,
]);

const ModalHeader = styled.div(() => [
  tw`relative flex items-start justify-between p-5 rounded-t`,
]);

const ModalTitle = styled.div(() => [tw`mr-12 text-3xl font-semibold`]);

const ModalCloseButton = styled.button(() => [
  tw`absolute inset-auto p-1 ml-auto text-black bg-transparent border-0`,
  tw`float-right p-0 m-0 text-3xl leading-none`,
  tw`font-semibold outline-none focus:outline-none`,
  css`
    right: 12px;
    top: 12px;
  `,
]);

const ModalCloseButtonContent = styled.span(() => [
  tw`block w-6 h-6 text-2xl text-black bg-transparent outline-none opacity-50 focus:outline-none`,
]);

const ModalBody = styled.div<ModalBodyProps>(({ hasFooter = false }) => [
  tw`relative flex-auto p-6`,
  !hasFooter && tw`rounded-b`,
]);

const ModalFooter = styled.div(() => [
  tw`flex items-center justify-end p-6 bg-gray-100 rounded-b`,
]);

const ModalComponent: React.FC<ModalComponentProps> = ({
  title,
  footer,
  children,
  showModal,
  onClose,
  size = 'medium',
}: ModalComponentProps) => (
  <>
    <ModalContainer showModal={showModal}>
      <ModalContentWrapper size={size}>
        <ModalContent onClick={(e) => e.preventDefault()}>
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            <ModalCloseButton onClick={onClose}>
              <ModalCloseButtonContent>×</ModalCloseButtonContent>
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody hasFooter={!!footer}>{children}</ModalBody>
          {footer ? <ModalFooter>{footer}</ModalFooter> : null}
        </ModalContent>
      </ModalContentWrapper>
      <ModalBackground onClick={onClose} />
    </ModalContainer>
  </>
);

export default ModalComponent;
