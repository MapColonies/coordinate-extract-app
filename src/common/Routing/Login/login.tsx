// login.tsx
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "./auth-context";
import { Box } from "@map-colonies/react-components";
import { TextField } from "@map-colonies/react-core";
import { head } from "lodash";

import "./login.css";

const Login: React.FC = () => {
  const { login } = useAuth();
  const history = useHistory();
  const location = useLocation<{ from?: string }>();
  const from = location.state?.from || "/";

  const handleLogin = () => {
    login({ id: "1", email: "user@example.com" });
    history.replace(from);
  };

  //   return <button onClick={handleLogin}>Login</button>;
  return (
      <Box className="loginContainer">
        <TextField
          // invalid={!isPasswordValid}
          className="passwordInput"
          label="User name"/*{intl.formatMessage({
            id: 'user-role.dialog.password.input.placeholder',
          })}*/
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
          className="passwordInput"
          // label={intl.formatMessage({
          //   id: 'user-role.dialog.password.input.placeholder',
          // })}
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
      </Box>
  );
};

export default Login;
