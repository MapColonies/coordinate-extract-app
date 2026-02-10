// login.tsx
import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import { Box } from '@map-colonies/react-components';
import { Button, Icon, TextField, Typography } from '@map-colonies/react-core';
import { LogoSVGIcon } from '../../icons/LogoSVGIcon';
import { Curtain } from '../../Curtain/curtain';
import { loginAPI } from '../../services/LoginService';
import { useAuth } from './AuthContext';

import './Login.css';

const Login: React.FC = () => {
  const { login } = useAuth();
  const history = useHistory();
  const location = useLocation<{ from?: string }>();
  const intl = useIntl();
  const from = location.state?.from || "/";
  const [userName, setUserName] = useState<string|undefined>(undefined);
  const [userPassword, setUserPassword] = useState<string|undefined>(undefined);
  const [error, setError] = useState<string|undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      const loginData = await loginAPI(userName as string, userPassword as string, setIsLoading, false);
      login({ username: userName as string });
      history.replace(from);
    }
    catch (e) {
      setError((e as any).message);
    }
  };

  const isLoginInfo = ():boolean => {
    return (!isEmpty(userName) && !isEmpty(userPassword));
  };

  return (
    <Box className="centerContainer">
      <Box className="loginContainer LoginHeader curtainContainer">
        {
          isLoading && <Curtain showProgress={true}/>
        }
        <Box className="Title">
          <Icon
            icon={{
              strategy: 'component',
              icon: (
                <Box className="Logo">
                  <LogoSVGIcon color="#000" />
                </Box>
              )
            }}
          />
          <FormattedMessage id="app.title" />
        </Box>
        <TextField
          className="loginControl"
          label={intl.formatMessage({
            id: 'auth.fields.user-name.label',
          })}
          type="text"
          required
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            setUserName(e.currentTarget.value.trim());
            setError(undefined);
          }}
          value={userName}
        />
        <TextField
          className="loginControl"
          label={intl.formatMessage({
            id: 'auth.fields.user-pwd.label',
          })}
          type="password"
          required
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            setUserPassword(e.currentTarget.value.trim());
            setError(undefined);
          }}
          // onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
          //   const SUBMIT_KEY = 'Enter'
          //   if (password && e.key === SUBMIT_KEY) {
          //     validatePassword();
          //   }
          // }}
          value={userPassword}
          autocomplete="off"
        />
        <Button 
          raised 
          onClick={handleLogin} 
          style={{width: '85%', marginRight: '20px'}}
          disabled={!isLoginInfo()}
        >
          <FormattedMessage id="auth.login.btn"/>
        </Button>
        <Typography tag="div" className='error' >
          {
            error && isLoginInfo() && <>
              Error: {error}
            </>
          }
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
