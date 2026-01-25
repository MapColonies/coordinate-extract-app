import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';

import './Header.css';

const Header: React.FC = (): JSX.Element => {
  return (
    <Box className="Header">
      <Typography tag="h3" className="Title">
        <FormattedMessage id='app.title' />
      </Typography>
    </Box>
  );
};

export default Header;
