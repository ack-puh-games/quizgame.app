import styled from '@emotion/styled';

export const StyledNavBar = styled.div`
  display: flex;
  justify-content: space-between;
  height: 48px;
  background-color: #444;
  color: #eee;
  font-size: 1.15em;
  margin-bottom: 12px;
  box-shadow: 0 0 12px 5px #847882;

  & > div {
    display: flex;
    align-items: center;
  }

  & > div > * {
    margin: 0 20px;
  }

  & a {
    color: #eee !important;
    text-decoration: none;
  }
`;

export const StyledUserAvatar = styled.div`
  height: 32px;
  width: 32px;
  border-radius: 32px;
  overflow: hidden;
  cursor: pointer;

  & img {
    height: 32px;
    width: 32px;
  }
`;
