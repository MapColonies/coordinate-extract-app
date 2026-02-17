import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { Avatar, Button, Icon, Typography } from '@map-colonies/react-core';
import { useAuth } from '../Routing/Login/AuthContext';
import { ExitSVGIcon } from '../icons/ExitSVGIcon';
import { LogoSVGIcon } from '../icons/LogoSVGIcon';

import './Header.css';

const Header: React.FC = (): JSX.Element => {
  const { user, logout } = useAuth();
  const intl = useIntl();
  
  return (
    <>
    {
      user &&
      <>
        <Box className="Header">
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
          <Box className="userInfo">
            <Box className="userName"> 
              <Typography tag="span">
                {user.username}
              </Typography>
            </Box>
            <Avatar className="avatar" name={user.username} size="large" />
            <Button 
              outlined
              label={intl.formatMessage({ id: 'auth.logout.btn' })}
              icon={<ExitSVGIcon color="currentColor" />}
              onClick={(): void => { logout(); }}
            />
          </Box>
        </Box>
      </>
    }
    </>
  );
};

export default Header;
