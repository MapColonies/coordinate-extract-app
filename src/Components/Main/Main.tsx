import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';

import './Main.css';

const Main: React.FC = (): JSX.Element => {
  return (
    <Box className="Main">
      <Typography tag="div" className="Content">
        <FormattedMessage id='app.welcome' />
      </Typography>
    </Box>
  );
};

export default Main;
