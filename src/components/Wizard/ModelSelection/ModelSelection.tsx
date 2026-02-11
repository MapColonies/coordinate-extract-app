import React, { useEffect, useState } from 'react';
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
import { fetchCatalog } from '../../../common/services/CatalogService';
import { Curtain } from '../../../common/Curtain/curtain';
import { getTokenResource } from '../../../utils/cesium';
import appConfig from '../../../utils/Config';
import { CatalogTree } from '../../common/Tree/CatalogTree/CatalogTree';
import { Terrain } from '../../common/Terrain/Terrain';
import { CatalogTreeNode, WizardSelectionProps } from '../Wizard.types';

import './ModelSelection.css';

export const ModelSelection: React.FC<WizardSelectionProps> = (props) => {
  const [isLoading, setIsLoading] = useState(true);
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
      const treeData = await fetchCatalog((value: boolean)=>{
        setTimeout( () => setIsLoading(value), 2000);
      });

      props.setCatalogTreeData(treeData.data.children as CatalogTreeNode[]);

      props.setCatalogTreeData(treeData.data.children as CatalogTreeNode[]);
      props.setItemsSummary({
        all: treeData.sumAll,
        extractable: treeData.sumExt,
        notExtractable: treeData.sumNExt
      });
    })();
  }, []);

  return (
    <Box className="modelSelection">
      <Box className="viewArea">
        <Box className="treeMapContainer">
          <Box className="panelHeader">
            <FormattedMessage id="tree.title" />
          </Box>
          <Box style={treeTheme as React.CSSProperties} className="treeContainer curtainContainer">
            {
              isLoading && <Curtain showProgress={true}/>
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
        <Box className="mapPanel">
          <CesiumMap
            center={JSON.parse(appConfig.mapCenter)}
            zoom={+appConfig.mapZoom}
            sceneMode={CesiumSceneMode.SCENE3D}
            baseMaps={appConfig.baseMaps}
            showActiveLayersTool={false}
          >
            {
              props.selectedItem?.['mc:links'] && (props.selectedItem?.isShown as boolean) &&
              <Cesium3DTileset
                url={getTokenResource(props.selectedItem?.['mc:links']["#text"] as string)}
                isZoomTo={true}
              />
            }
            {
              props.selectedItem?.['mc:footprint'] &&
              <CesiumGeojsonLayer
                clampToGround={true}
                data={JSON.parse(props.selectedItem?.['mc:footprint']) as Geometry}
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
            <Terrain />
          </CesiumMap>
        </Box>
      </Box>
    </Box>
  );
};
