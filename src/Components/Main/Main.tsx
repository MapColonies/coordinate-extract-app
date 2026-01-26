import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';

import './Main.css';
import { Wizard } from '../Wizard/Wizard';

const Main: React.FC = (): JSX.Element => {
  return (
    <Box className="Main">
      <Wizard />
    </Box>
  );
};

export default Main;
