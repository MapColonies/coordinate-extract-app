import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';
import { GeojsonMap } from '../../common/GeojsonMap/GeojsonMap';
import { CatalogTree } from '../../common/Tree/CatalogTree/CatalogTree';
import { ModelDetails } from '../../common/ModelDetails/ModelDetails';
import { mockCatalogData } from '../../common/CatalogMockData';
import { CatalogTreeNode, WizardSelectionProps } from '../Wizard.types';

import './ModelSelectionStep.css';

export const ModelSelectionStep: React.FC<WizardSelectionProps> = ({
  catalogTreeData,
  setCatalogTreeData,
  selectedItem,
  setSelectedItem,
  setIsNextBtnDisabled
}) => {

  useEffect(() => {
    if (!selectedItem) {
      setIsNextBtnDisabled(true);
    } else {
      setIsNextBtnDisabled(false);
    }
  }, []);

  useEffect(() => {
    if (!catalogTreeData) {
      setTimeout(() => {
        setCatalogTreeData(mockCatalogData as unknown as CatalogTreeNode[]);
      }, 500);
    }
  }, []);

  const handleSelectedItem = (node: CatalogTreeNode | null, updatedTreeData: CatalogTreeNode[]) => {
    if (updatedTreeData) {
      setCatalogTreeData(updatedTreeData);
    }
    if (node) {
      setSelectedItem?.(node);
      setIsNextBtnDisabled(false);
    } else {
      setIsNextBtnDisabled(true);
    }
  };

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
            <FormattedMessage id="title.tree" />
          </Box>
          <Box style={treeTheme as React.CSSProperties} className="treeContent">
            <CatalogTree
              treeData={catalogTreeData ?? {} as CatalogTreeNode[]}
              onSelectedNode={handleSelectedItem}
            />
          </Box>
        </Box>
        <Box className="mapPanel">
          <Typography className="panelHeader">
            <FormattedMessage id="title.map" />
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
