import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { Button, Icon, Typography } from '@map-colonies/react-core';
import { useAuth } from '../Routing/Login/auth-context';
import { ExitSVGIcon } from '../Icons/Svg/exit';
import { LogoSVGIcon } from '../Icons/Svg/logo';

import './Header.css';

const Header: React.FC = (): JSX.Element => {
  const { user, logout } = useAuth();
  const intl = useIntl();
  
  return (
    <>
    {user && <>
      <Box className="Header">
        <Box className="Title">
         <Icon
            icon={{
              strategy: 'component',
              icon: (
                <Box className='Logo'>
                  <LogoSVGIcon color='#000' />
                </Box>
              )
            }}
          />
          <FormattedMessage id="app.title" />
        </Box>
        {/* <Typography tag="div" className="Title">
          <FormattedMessage id="app.title" />
        </Typography> */}

        <Box className="userInfo">
          <span>{user.email}</span>
          <Button 
            label={intl.formatMessage({ id: 'auth.logout.btn' })}
            icon={<ExitSVGIcon color='red' />}
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
