import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Box, CesiumMap, CesiumSceneMode } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';
import appConfig from '../../../utils/Config';
import { fetchCatalog } from '../../../common/Services/CatalogService';
import { CatalogTree } from '../../common/Tree/CatalogTree/CatalogTree';
import { ModelDetails } from '../../common/ModelDetails/ModelDetails';
// import { mockCatalogData } from '../../common/CatalogMockData';
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
    // if (!catalogTreeData) {
    //   setTimeout(() => {
    //     setCatalogTreeData(mockCatalogData as unknown as CatalogTreeNode[]);
    //   }, 500);
    // }

    (async () => {
      try {
        const treeData = await fetchCatalog();
        //@ts-ignore
        setCatalogTreeData(treeData.children);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
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
  const { ["mc:footprint"]: footprint, ["mc:links"]: links, ...rest } = selectedItem || {};

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
          <CesiumMap
            style={{ position: 'relative', height: '450px' }}
            center={JSON.parse(appConfig.mapCenter)}
            zoom={+appConfig.mapZoom}
            sceneMode={CesiumSceneMode.SCENE3D}
            baseMaps={appConfig.baseMaps}
          >
            {/* {models.map((model) => {
              let links = model["mc:links"] as any;
              if (Array.isArray(links)) {
                links = links.find((link) => link["@_scheme"] === LinkType.THREE_D_LAYER || link["@_scheme"] === LinkType.THREE_D_TILES);
              }
              return (
                <Cesium3DTileset
                  maximumScreenSpaceError={CONFIG.THREE_D_LAYER.MAXIMUM_SCREEN_SPACE_ERROR}
                  cullRequestsWhileMovingMultiplier={CONFIG.THREE_D_LAYER.CULL_REQUESTS_WHILE_MOVING_MULTIPLIER}
                  preloadFlightDestinations
                  preferLeaves
                  skipLevelOfDetail
                  key={layer.id}
                  url={getTokenResource(layerLink.url as string, (layer as Layer3DRecordModelType).productVersion as string)}
                />
              );
            })}

            {shouldShowExtent && (
              <CesiumGeojsonLayer
                clampToGround={true}
                data={getFootprintsCollection(footprints, true)}
                onLoad={(geojsonDataSource) => {
                  geojsonDataSource.entities.values.forEach((item) => {
                    if (item.polyline) {
                      const color = CesiumColor.CYAN;
                      (item.polyline.width as CesiumConstantProperty).setValue(5);
                      // @ts-ignore
                      item.polyline.material = color;
                    }
                  });
                }}
              />
            )} */}
          </CesiumMap>
        </Box>
      </Box>
      <ModelDetails metadata={rest} />
    </Box>
  );
};
