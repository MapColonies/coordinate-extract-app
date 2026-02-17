import { PropsWithChildren } from 'react';
import { FormattedMessage } from 'react-intl';
import { Geometry } from 'geojson';
import { Box } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';
import { CatalogTreeNode } from '../../Wizard/Wizard.types';
import { GeojsonMap } from '../GeojsonMap/GeojsonMap';
import { ModelDetails } from '../ModelDetails/ModelDetails';

import './Step.css';

interface StepProps {
  selectedItem?: CatalogTreeNode;
  title?: string;
}

export const Step: React.FC<PropsWithChildren<StepProps>> = ({ children, selectedItem, title }) => {
  const {
    "mc:footprint": footprint,
    "mc:links": links,
    ...metadata
  } = (selectedItem || {}) as CatalogTreeNode;

  return (
    <Box className="step">
      <ModelDetails item={metadata} />
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
        <Box className="panel">
          <Typography className="panelHeader">
            <FormattedMessage id="panel.footprint.title" />
          </Typography>
          {
            footprint &&
            <GeojsonMap geometry={JSON.parse(footprint) as Geometry} />
          }
        </Box>
      </Box>
    </Box>
  );
};
