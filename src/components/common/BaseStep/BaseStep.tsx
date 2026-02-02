import { PropsWithChildren } from 'react';
import { FormattedMessage } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';
import { Metadata } from '../../Wizard/Wizard.types';
import { GeojsonMap } from '../GeojsonMap/GeojsonMap';
import { ModelDetails } from '../ModelDetails/ModelDetails';

import './BaseStep.css';

interface BaseStepProps {
  metadata?: Metadata;
  titleMap?: string;
  title?: string;
};

export const BaseStep: React.FC<PropsWithChildren<BaseStepProps>> = ({ children, metadata, title, titleMap }) => {
  const { footprint, links, ...rest } = (metadata ?? {}) as Metadata;

  return (
    <Box id='baseStep'>
      <ModelDetails metadata={rest} />
      <Box className="viewArea">
        <Box className="panel">
          {
            title &&
            <Typography className="panelHeader">
              <FormattedMessage id={title} />
            </Typography>
          }
          <Box className="children">
            {children}
          </Box>
        </Box>
        <Box className="panel small">
          {
            titleMap &&
            <Typography className="panelHeader">
              <FormattedMessage id={titleMap} />
            </Typography>
          }
          <GeojsonMap
            geometry={metadata?.footprint}
            style={{ width: '100%', height: '100%' }}
          />
        </Box>
      </Box>
    </Box>
  );
};
