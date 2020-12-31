import * as React from 'react';

import { CommonWrapper, PageWrapper } from '../components';

import LoginButton from './LoginButton';

const Login: React.FC = () => {
  return (
    <PageWrapper title="Login" traceId="login-page" authCheckRequired={false}>
      <CommonWrapper>
        <span>oops you aren't logged in lol</span>
        <br />
        <LoginButton />
      </CommonWrapper>
    </PageWrapper>
  );
};

export default Login;
