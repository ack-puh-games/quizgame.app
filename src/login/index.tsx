import * as React from 'react';
import tw, { styled } from 'twin.macro';

import { CommonWrapper, PageWrapper } from '../components';

import LoginButton from './LoginButton';

const Header = styled.span(() => [tw`text-3xl font-bold`]);

const Login: React.FC = () => {
  return (
    <PageWrapper title="Login" traceId="login-page" authCheckRequired={false}>
      <CommonWrapper>
        <Header>You'll need to log in before you can play.</Header>
        <br />
        <LoginButton />
      </CommonWrapper>
    </PageWrapper>
  );
};

export default Login;
