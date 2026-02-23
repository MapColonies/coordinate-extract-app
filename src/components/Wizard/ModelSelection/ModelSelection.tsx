import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Geometry } from 'geojson';
import {
  Box,
  Cesium3DTileset,
  CesiumMap,
  CesiumSceneMode
} from '@map-colonies/react-components';
import { Curtain } from '../../../common/Curtain/curtain';
import { fetchCatalog } from '../../../common/services/CatalogService';
import { CesiumPOI } from '../../../utils/Cesium/CesiumPOI/CesiumPOI';
import { getTokenResource } from '../../../utils/Cesium/CesiumResource';
import appConfig from '../../../utils/Config';
import { Terrain } from '../../common/Terrain/Terrain';
import { CatalogTree } from '../../common/Tree/CatalogTree/CatalogTree';
import { CatalogTreeNode, IDENTIFIER_FIELD, WizardSelectionProps } from '../Wizard.types';
import { CesiumGeojsonFootprint } from './CesiumGeojsonFootprint';

import './ModelSelection.css';

export const ModelSelection: React.FC<WizardSelectionProps> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [finishedFlying, setFinishedFlying] = useState(false);

  const treeTheme = {
    "--rst-selected-background-color": '#f8fafc33',
    "--rst-hover-background-color": '#1e293b80',
    "--rst-highlight-line-size": '6px',
    "--rst-node-label-width": '280px',
    "--rst-expander-size": '30px',
  };

  useEffect(() => {
    if (!props.selectedItem) {
      props.setIsNextBtnDisabled(true);
    } else {
      props.setIsNextBtnDisabled(false);
    }
  }, []);

  useEffect(() => {
    if (props.selectedItem?.isSelected) {
      props.setIsNextBtnDisabled(false);
    } else {
      props.setIsNextBtnDisabled(true);
    }
  }, [props.selectedItem]);

  useEffect(() => {
    if (props.catalogTreeData) {
      setIsLoading(false);
      return;
    }
    (async () => {
      const treeData = await fetchCatalog(setIsLoading);
      props.setCatalogTreeData(treeData.data.children as CatalogTreeNode[]);
      props.setItemsSummary({
        all: treeData.sumAll,
        extractable: treeData.sumExtractable,
        notExtractable: treeData.sumNotExtractable
      });
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
  }, [props.selectedItem?.[IDENTIFIER_FIELD]]);

  const tileset = useMemo(() => {
    if (props.selectedItem?.['mc:links'] && props.selectedItem?.isShown && finishedFlying) {
      return (
        <Cesium3DTileset
          url={getTokenResource(props.selectedItem?.['mc:links']["#text"] as string)}
          isZoomTo={true}
          maximumScreenSpaceError={5}
          cullRequestsWhileMovingMultiplier={120}
          preloadFlightDestinations
          preferLeaves
          skipLevelOfDetail
        />
      )
    }

    return null;
  }, [
    props.selectedItem?.[IDENTIFIER_FIELD],
    props.selectedItem?.isShown,
    finishedFlying
  ]);

  return (
    <Box className="modelSelection">
      <Box className="viewArea">
        <Box className="treeMapContainer">
          <Box className="panelHeader">
            <FormattedMessage id="tree.title" />
          </Box>
          <Box style={treeTheme as React.CSSProperties} className="treeContainer curtainContainer">
            {
              isLoading && <Curtain showProgress={true} />
            }
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
        <Box className="mapPanel curtainContainer">
          {
            isLoading && <Curtain showProgress={true} />
          }
          <CesiumMap
            center={centerCesiumView}
            zoom={+appConfig.mapZoom}
            sceneMode={CesiumSceneMode.SCENE3D}
            baseMaps={appConfig.baseMaps}
            showActiveLayersTool={false}
            infoBox={false}
          >
            {
              props.selectedItem?.isSelected as boolean &&
              props.selectedItem?.['mc:footprint'] &&
              <CesiumGeojsonFootprint
                id={props.selectedItem[IDENTIFIER_FIELD] as string}
                clampToGround={true}
                data={selectedItemFootprint}
                setIsInProgress={(val) => {
                  setFinishedFlying(!val);
                  setIsLoading(val);
                }}
              />
            }
            {
              tileset
            }
            {
              appConfig.showPOITool &&
              <CesiumPOI
                setIsInProgress={(val) => {
                  setIsLoading(val);
                }}
                glowDependencies={{
                  isShown: props.selectedItem?.isShown,
                  selectedItem: props.selectedItem,
                  isSelected: props.selectedItem?.isSelected,
                }}
              />
            }
            <Terrain />
          </CesiumMap>
        </Box>
      </Box>
    </Box>
  );
};
