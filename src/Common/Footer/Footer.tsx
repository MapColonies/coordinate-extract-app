import React from 'react';
import { useIntl } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { IconButton, Tooltip } from '@map-colonies/react-core';

import './Footer.css';

const Footer: React.FC = (): JSX.Element => {
  const intl = useIntl();
  
  return (
    <Box className="Footer">
      <Tooltip content={intl.formatMessage({ id: 'footer.back' })}>
        <IconButton className="icon mc-icon-Next" onClick={(e): void => { e.preventDefault(); e.stopPropagation(); }} />
      </Tooltip>
      <Tooltip content={intl.formatMessage({ id: 'footer.next' })}>
        <IconButton className="icon mc-icon-Back" onClick={(e): void => { e.preventDefault(); e.stopPropagation(); }} />
      </Tooltip>
    </Box>
  );
};

export default Footer;
