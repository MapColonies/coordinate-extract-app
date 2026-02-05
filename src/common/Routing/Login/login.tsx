// login.tsx
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory, useLocation } from "react-router-dom";
import { Box } from "@map-colonies/react-components";
import { Button, TextField } from "@map-colonies/react-core";
import { useAuth } from "./auth-context";

import "./login.css";

const Login: React.FC = () => {
  const { login } = useAuth();
  const history = useHistory();
  const location = useLocation<{ from?: string }>();
  const intl = useIntl();
  const from = location.state?.from || "/";

  const handleLogin = () => {
    login({ id: "1", email: "user@example.com" });
    history.replace(from);
  };

  //   return <button onClick={handleLogin}>Login</button>;
  return (
    <Box className="centerContainer">
      <Box className="loginContainer">
        <TextField
          // invalid={!isPasswordValid}
          className="loginControl"
          label={intl.formatMessage({
            id: 'auth.fields.user-name.label',
          })}
          type="text"
          // onChange={(e: React.FormEvent<HTMLInputElement>): void => {
          //   setPassword(e.currentTarget.value.trim());
          // }}
          // onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
          //   const SUBMIT_KEY = 'Enter'
          //   if (password && e.key === SUBMIT_KEY) {
          //     validatePassword();
          //   }
          // }}
          // value={password}
        />
        <TextField
          // invalid={!isPasswordValid}
          className="loginControl"
          label={intl.formatMessage({
            id: 'auth.fields.user-pwd.label',
          })}
          type="password"
          // onChange={(e: React.FormEvent<HTMLInputElement>): void => {
          //   setPassword(e.currentTarget.value.trim());
          // }}
          // onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
          //   const SUBMIT_KEY = 'Enter'
          //   if (password && e.key === SUBMIT_KEY) {
          //     validatePassword();
          //   }
          // }}
          // value={password}
        />
        <Button raised onClick={handleLogin} style={{width: '100%'}}>
          <FormattedMessage id="auth.login.btn"/>
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
