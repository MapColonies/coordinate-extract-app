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
  /* eslint-disable no-useless-computed-key */
  // @ts-ignore
  const { ["mc:footprint"]: footprint, ["mc:links"]: links, ...metadata } = selectedItem || {};
  /* eslint-enable no-useless-computed-key */

  return (
    <Box className="step">
      <ModelDetails metadata={metadata} />
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
          <Typography className="panelHeader">
            <FormattedMessage id="title.footprint" />
          </Typography>
          {
            footprint &&
            <GeojsonMap
              geometry={JSON.parse(footprint) as Geometry}
              style={{ width: '100%', height: '100%' }}
            />
          }
        </Box>
      </Box>
    </Box>
  );
};
