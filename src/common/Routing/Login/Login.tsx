import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { Box } from '@map-colonies/react-components';
import { Button, Icon, TextField, Typography } from '@map-colonies/react-core';
import { AutoDirectionBox } from '../../AutoDirectionBox/AutoDirectionBox';
import { Curtain } from '../../Curtain/curtain';
import { LogoSVGIcon } from '../../icons/LogoSVGIcon';
import { loginAPI } from '../../services/LoginService';
import { useAuth } from './AuthContext';

import './Login.css';

const Login: React.FC = () => {
  const { login } = useAuth();
  const history = useHistory();
  const location = useLocation<{ from?: string }>();
  const intl = useIntl();
  const from = location.state?.from || "/";
  const [userName, setUserName] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      const loginData = await loginAPI(userName as string, userPassword as string, setIsLoading);
      if (loginData?.isValid !== true) {
        let message = loginData?.message || 'Login failed';
        if (loginData?.isValid === false) {
          message = intl.formatMessage({ id: `err.code.${loginData?.code}` });
        }
        throw new Error(message);
      }
      login({ username: userName as string });
      history.replace(from);
    } catch (e) {
      setError((e as any).message);
    }
  };

  const isLoginInfo = (): boolean => {
    return (!isEmpty(userName) && !isEmpty(userPassword));
  };

  return (
    <Box className="login">
      <Box className="loginContainer LoginHeader curtainContainer">
        {
          isLoading &&
          <Curtain showProgress={true}/>
        }
        <Box className="Title">
          <Icon
            icon={{
              strategy: 'component',
              icon: (
                <Box className="Logo">
                  <LogoSVGIcon color="var(--mdc-theme-background)" />
                </Box>
              )
            }}
          />
          <FormattedMessage id="app.title" />
        </Box>
        <TextField
          className="loginControl"
          label={intl.formatMessage({ id: 'auth.fields.username.label' })}
          type="text"
          required
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            setUserName(e.currentTarget.value.trim());
            setError(undefined);
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
            const SUBMIT_KEY = 'Enter'
            if (isLoginInfo() && e.key === SUBMIT_KEY) {
              handleLogin();
            }
          }}
          value={userName}
          autoComplete="off"
        />
        <TextField
          className="loginControl"
          label={intl.formatMessage({ id: 'auth.fields.password.label' })}
          type="password"
          required
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            setUserPassword(e.currentTarget.value.trim());
            setError(undefined);
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
            const SUBMIT_KEY = 'Enter'
            if (isLoginInfo() && e.key === SUBMIT_KEY) {
              handleLogin();
            }
          }}
          value={userPassword}
          autoComplete="off"
        />
        <Button 
          raised 
          className="loginAction"
          onClick={handleLogin}
          disabled={!isLoginInfo() || !!error}
        >
          <FormattedMessage id="auth.login.btn"/>
        </Button>
        <Typography tag="div" className="error" >
          {
            error && isLoginInfo() &&
            <AutoDirectionBox>
              {intl.formatMessage({ id: 'auth.error' }, { value: error })}
            </AutoDirectionBox>
          }
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
