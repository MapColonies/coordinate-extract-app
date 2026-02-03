import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Geometry } from 'geojson';
import {
  Box,
  Cesium3DTileset,
  CesiumColor,
  CesiumConstantProperty,
  CesiumGeojsonLayer,
  CesiumMap,
  CesiumSceneMode
} from '@map-colonies/react-components';
import { getTokenResource } from '../../../utils/cesium';
import appConfig from '../../../utils/Config';
// import { mockCatalogData } from '../../common/CatalogMockData';
import { fetchCatalog } from '../../../common/services/CatalogService';
import { CatalogTree } from '../../common/Tree/CatalogTree/CatalogTree';
import { CatalogTreeNode, WizardSelectionProps } from '../Wizard.types';

import './ModelSelection.css';

export const ModelSelection: React.FC<WizardSelectionProps> = ({
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

  /* eslint-disable no-useless-computed-key */
  // @ts-ignore
  const { ["mc:footprint"]: footprint, ["mc:links"]: links, ...metadata } = selectedItem || {};
  /* eslint-enable no-useless-computed-key */

  return (
    <Box className="modelSelection">
      <Box className="viewArea">
        <Box className="treeMapContainer">
          <Box className="panelHeader">
            <FormattedMessage id="title.tree" />
          </Box>
          <Box style={treeTheme as React.CSSProperties} className="tree">
            <CatalogTree
              treeData={catalogTreeData ?? []}
              onSelectedNode={handleSelectedItem}
            />
          </Box>
        </Box>
        <Box className="mapPanel">
          <Box className="panelHeader">
            <FormattedMessage id="title.map" />
          </Box>
          <CesiumMap
            center={JSON.parse(appConfig.mapCenter)}
            zoom={+appConfig.mapZoom}
            sceneMode={CesiumSceneMode.SCENE3D}
            baseMaps={appConfig.baseMaps}
            showActiveLayersTool={false}
          >
            {
              metadata && links &&
              <Cesium3DTileset
                maximumScreenSpaceError={5}
                cullRequestsWhileMovingMultiplier={120}
                preloadFlightDestinations
                preferLeaves
                skipLevelOfDetail
                url={getTokenResource(links["#text"])}
                isZoomTo={true}
              />
            }
            {
              footprint &&
              <CesiumGeojsonLayer
                clampToGround={true}
                data={JSON.parse(footprint) as Geometry}
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
            }
          </CesiumMap>
        </Box>
      </Box>
    </Box>
  );
};
