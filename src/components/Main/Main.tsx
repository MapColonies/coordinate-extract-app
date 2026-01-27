import React from 'react';
import { Box } from '@map-colonies/react-components';
import { Wizard } from '../Wizard/Wizard';

import './Main.css';

const Main: React.FC = (): JSX.Element => {
  return (
    <Box className="Main">
      <Wizard />
    </Box>
  );
};

export default Main;
