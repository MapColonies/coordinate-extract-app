import React, { useState } from 'react';
import { Box } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';
import { GeojsonMap } from '../../common/GeojsonMap/GeojsonMap';
import { CatalogTree } from '../../common/Tree/CatalogTree/CatalogTree';
import { ModelDetails } from '../../common/ModelDetails/ModelDetails';
import { mockCatalogData } from '../../common/CatalogMockData';
import { WizardStepProps, CatalogTreeNode } from '../Wizard.types';

import './ModelSelectionStep.css';

export const CatalogTreeStep: React.FC<WizardStepProps> = ({ onNext }) => {
  const [selectedNode, setSelectedNode] = useState<CatalogTreeNode | null>();

  const handleNext = () => {
    if (selectedNode && onNext) {
      onNext(selectedNode);
    }
  };

  const treeTheme = {
    // "--rst-selected-background-color": "rgb(30, 41, 59)",
    "--rst-selected-background-color": "#f8fafc33",
    "--rst-hover-background-color": '#1e293b80',
    "--rst-highlight-line-size": '6px',
    "--rst-node-label-width": '280px',
    "--rst-expander-size": '30px',
  };

  //@ts-ignore
  const { footprint, links, ...rest } = selectedNode?.metadata || {};

  return (
    <Box id='modelSelection'>
      <Box className="viewArea">
        <Box className="tree-map-container">
          <Box className="panel-header">Catalog Tree</Box>
          <Box style={{
            height: '100%',
            ...treeTheme
          }} className="tree-content">
            <CatalogTree
              treeData={mockCatalogData as unknown as CatalogTreeNode[]}
              onSelectedNode={(node) => setSelectedNode(node)}
            />
          </Box>
        </Box>
        <Box className="map-panel">
          <Typography className="panel-header">Map View</Typography>
          <Box className="map-view">
            <GeojsonMap
              geometry={selectedNode?.metadata?.footprint}
              style={{ width: '100%', height: '100%' }}
            />

          </Box>
        </Box>
        {/* <ModelDetails metadata={selectedNode?.metadata} /> */}
      </Box>
      <ModelDetails metadata={rest} />

      <Box className="step-actions">
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!selectedNode}
        >
          Next: Edit Metadata
        </button>

        {selectedNode && (
          <Box className="selected-info">
            Selected: {selectedNode.title}
          </Box>
        )}
      </Box>
    </Box>
  );
};
