import * as React from 'react';

import LoginButton from './LoginButton';
import PageWrapper from '../util/PageWrapper';

const Login: React.FC = () => {
  return (
    <PageWrapper title="Login" traceId="login-page" authCheckRequired={false}>
      <span>oops you aren't logged in lol</span>
      <br />
      <LoginButton />
    </PageWrapper>
  );
};

export default Login;
