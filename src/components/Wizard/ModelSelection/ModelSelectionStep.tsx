import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';
import { GeojsonMap } from '../../common/GeojsonMap/GeojsonMap';
import { CatalogTree } from '../../common/Tree/CatalogTree/CatalogTree';
import { ModelDetails } from '../../common/ModelDetails/ModelDetails';
import { mockCatalogData } from '../../common/CatalogMockData';
import { WizardStepProps, CatalogTreeNode } from '../Wizard.types';

import './ModelSelectionStep.css';

export const CatalogTreeStep: React.FC<WizardStepProps> = ({ selectedItem, setSelectedItem }) => {

  const treeTheme = {
    "--rst-selected-background-color": '#f8fafc33',
    "--rst-hover-background-color": '#1e293b80',
    "--rst-highlight-line-size": '6px',
    "--rst-node-label-width": '280px',
    "--rst-expander-size": '30px',
  };

  //@ts-ignore
  const { footprint, links, ...rest } = selectedItem?.metadata || {};

  return (
    <Box id='modelSelection'>
      <Box className="viewArea">
        <Box className="treeMapContainer">
          <Box className="panelHeader">
            <FormattedMessage id="title.tree"/>
          </Box>
          <Box style={treeTheme as React.CSSProperties} className="treeContent">
            <CatalogTree
              treeData={mockCatalogData as unknown as CatalogTreeNode[]}
              onSelectedNode={(node) => setSelectedItem(node)}
            />
          </Box>
        </Box>
        <Box className="mapPanel">
          <Typography className="panelHeader">
            <FormattedMessage id="title.map"/>
          </Typography>
          <GeojsonMap
            geometry={selectedItem?.metadata?.footprint}
            style={{ width: '100%', height: '100%' }}
          />
        </Box>
      </Box>
      <ModelDetails metadata={rest} />
    </Box>
  );
};
