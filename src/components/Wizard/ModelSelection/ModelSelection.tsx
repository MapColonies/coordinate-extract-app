import React, { useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Geometry } from 'geojson';
import {
  Box,
  Cesium3DTileset,
  CesiumColor,
  CesiumConstantProperty,
  CesiumGeojsonLayer,
  CesiumMap,
  CesiumSceneMode,
  useCesiumMap
} from '@map-colonies/react-components';
import { fetchCatalog } from '../../../common/services/CatalogService';
import { getTokenResource } from '../../../utils/cesium';
import appConfig from '../../../utils/Config';
import { CatalogTree } from '../../common/Tree/CatalogTree/CatalogTree';
import { Terrain } from '../../common/Terrain/Terrain';
import { CatalogTreeNode, WizardSelectionProps } from '../Wizard.types';

import './ModelSelection.css';
import { CesiumGeojsonFootprint } from './CesiumGeojsonLayer';

export const ModelSelection: React.FC<WizardSelectionProps> = (props) => {

  useEffect(() => {
    if (props.selectedItem?.isSelected) {
      props.setIsNextBtnDisabled(false);
    } else {
      props.setIsNextBtnDisabled(true);
    }
  }, [props.selectedItem]);

  const treeTheme = {
    "--rst-selected-background-color": '#f8fafc33',
    "--rst-hover-background-color": '#1e293b80',
    "--rst-highlight-line-size": '6px',
    "--rst-node-label-width": '280px',
    "--rst-expander-size": '30px',
  };

  useEffect(() => {
    if (props.catalogTreeData) {
      return;
    }

    (async () => {
      try {
        const treeData = await fetchCatalog();

        props.setCatalogTreeData(treeData.data.children as CatalogTreeNode[]);

        props.setCatalogTreeData(treeData.data.children as CatalogTreeNode[]);
        props.setItemsSummary({
          all: treeData.sumAll,
          extractable: treeData.sumExt,
          notExtractable: treeData.sumNExt
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, []);

  const centerCesiumView = useMemo(() => {
    return JSON.parse(appConfig.mapCenter);
  }, [appConfig.mapCenter]);

  const selectedItemFootprint = useMemo(() => {
    if (!props.selectedItem?.['mc:footprint']) {
      return;
    }
    return JSON.parse(props.selectedItem?.['mc:footprint']) as Geometry;
  }, [props.selectedItem]);

  return (
    <Box className="modelSelection">
      <Box className="viewArea">
        <Box className="treeMapContainer">
          <Box className="panelHeader">
            <FormattedMessage id="tree.title" />
          </Box>
          <Box style={treeTheme as React.CSSProperties} className="treeContainer">
            {
              props.catalogTreeData &&
              <CatalogTree
                treeData={props.catalogTreeData}
                setTreeData={props.setCatalogTreeData}
                setSelectedNode={props.setSelectedItem as (item?: CatalogTreeNode) => void}
                selectedNode={props.selectedItem}
                itemsSummary={props.itemsSummary}
                setItemsSummary={props.setItemsSummary}
              />
            }
          </Box>
        </Box>
        <Box className="mapPanel">
          <CesiumMap
            center={centerCesiumView}
            zoom={+appConfig.mapZoom}
            sceneMode={CesiumSceneMode.SCENE3D}
            baseMaps={appConfig.baseMaps}
            showActiveLayersTool={false}
            infoBox={false}
          >
            {
              props.selectedItem?.['mc:links'] && (props.selectedItem?.isShown as boolean) &&
              <Cesium3DTileset
                url={getTokenResource(props.selectedItem?.['mc:links']["#text"] as string)}
                isZoomTo={true}
              />
            }
            {
              props.selectedItem?.isSelected as boolean && props.selectedItem?.['mc:footprint'] &&
              <CesiumGeojsonFootprint
                clampToGround={true}
                data={selectedItemFootprint}
              />
            }
            <Terrain />
          </CesiumMap>
        </Box>
      </Box>
    </Box>
  );
};
