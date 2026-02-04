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
import { getTokenResource } from '../../../utils/cesium';
import appConfig from '../../../utils/Config';
import { useDebounce } from '../../../hooks/useDebounce';
import { CatalogTree } from '../../common/Tree/CatalogTree/CatalogTree';
import { useTreeCatalogData } from '../../common/Tree/hooks/treeCatalogData.hook';
import { CatalogTreeNode, WizardSelectionProps } from '../Wizard.types';

import './ModelSelection.css';

export const ModelSelection: React.FC<WizardSelectionProps> = ({
  catalogTreeData,
  setCatalogTreeData,
  selectedItem,
  setSelectedItem,
  setIsNextBtnDisabled
}) => {
  const [searchText, setSearchText] = useState("");

  const debouncedSearch = useDebounce((value: string) => {
    setSearchText(value);
  }, 300);

  const { treeData } = useTreeCatalogData({
    catalogTreeData,
    setCatalogTreeData,
    filterSearchText: searchText
  });

  useEffect(() => {
    if (!selectedItem) {
      setIsNextBtnDisabled(true);
    } else {
      setIsNextBtnDisabled(false);
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

  const {
    "mc:footprint": footprint,
    "mc:links": links,
    ...metadata
  } = (selectedItem || {}) as CatalogTreeNode;

  return (
    <Box className="modelSelection">
      <Box className="viewArea">
        <Box className="treeMapContainer">
          <Box className="panelHeader">
            <FormattedMessage id="title.tree" />
          </Box>

          <Box className="form-group">
            <input
              type="text"
              id="title"
              name="title"
              onChange={(e) => {
                const value = e.target.value;
                debouncedSearch(value);
              }}
              required
              className="form-control"
            />
          </Box>
          <Box style={treeTheme as React.CSSProperties} className="tree">
            <CatalogTree
              treeData={treeData as CatalogTreeNode[]}
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
              links &&
              <Cesium3DTileset
                url={getTokenResource(links["#text"] as string)}
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
            {/* <Terrain/> */}
          </CesiumMap>
        </Box>
      </Box>
    </Box>
  );
};
