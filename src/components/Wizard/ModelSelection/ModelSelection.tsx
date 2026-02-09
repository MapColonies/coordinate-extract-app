import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
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
import { Button, TextField } from '@map-colonies/react-core';
import { getTokenResource } from '../../../utils/cesium';
import appConfig from '../../../utils/Config';
import { useDebounce } from '../../../hooks/useDebounce';
import { Terrain } from '../../common/Terrain/Terrain';
import { CatalogTree } from '../../common/Tree/CatalogTree/CatalogTree';
import { FilterOpt, useTreeCatalogData } from '../../common/Tree/hooks/treeCatalogData.hook';
import { CatalogTreeNode, IDENTIFIER_FIELD, MAIN_FIELD, WizardSelectionProps } from '../Wizard.types';

import './ModelSelection.css';

const FILTER_BY_DATA_FIELD = IDENTIFIER_FIELD;
const QUICK_FILTER_BY_DATA_FIELD = MAIN_FIELD;

export const ModelSelection: React.FC<WizardSelectionProps> = (props) => {
  const [filterOptions, setFilterBy] = useState<FilterOpt>({ type: 'field', fieldName: FILTER_BY_DATA_FIELD, fieldValue: '' });
  const intl = useIntl();

  const debouncedSearch = useDebounce((value: string) => {
    setFilterBy({ type: 'field', fieldName: FILTER_BY_DATA_FIELD, fieldValue: value });
  }, 300);

  const {
    treeData,
    handleRowClick,
    updateNodeByProductName
  } = useTreeCatalogData({
    catalogTreeData: props.catalogTreeData,
    setCatalogTreeData: props.setCatalogTreeData,
    filter: filterOptions,
    setSummaryCount: (sum) => {
      props.setItemsSummary?.(sum);
    }
  });

  useEffect(() => {
    if (!props.selectedItem) {
      props.setIsNextBtnDisabled(true);
    } else {
      props.setIsNextBtnDisabled(false);
    }
  }, []);

  const handleSelectedItem = (node: CatalogTreeNode | null) => {
    if (node) {
      props.setSelectedItem?.(node);
      props.setIsNextBtnDisabled(false);
    } else {
      props.setIsNextBtnDisabled(true);
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
    "mc:links": links
  } = (selectedItem || {}) as CatalogTreeNode;

  return (
    <Box className="modelSelection">
      <Box className="viewArea">
        <Box className="treeMapContainer">
          <Box className="panelHeader">
            <FormattedMessage id="tree.title" />
          </Box>
          <Box className="filter">
            <TextField
              type="text"
              className="textField"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                debouncedSearch(value);
              }}
              placeholder={intl.formatMessage({ id: 'tree.filter.placeholder' })}
            />
            <Box className="filterBtnsContainer">
              <Button className="filterBtn"
                onClick={() => setFilterBy({ type: 'none' })}>
                <FormattedMessage id="tree.filter.all" values={{ sum: props.itemsSummary?.all }} />
              </Button>
              <Button className="filterBtn"
                onClick={() => setFilterBy({
                  type: 'field',
                  fieldName: QUICK_FILTER_BY_DATA_FIELD,
                  fieldValue: true
                })}
                style={{ color: 'var(--mdc-theme-gc-success)' }}
              >
                <FormattedMessage id="tree.filter.approved" values={{ sum: props.itemsSummary?.extractable }} />
              </Button>
              <Button className="filterBtn"
                onClick={() => setFilterBy({
                  type: 'field',
                  fieldName: QUICK_FILTER_BY_DATA_FIELD,
                  fieldValue: false
                })}
                style={{ color: 'var(--mdc-theme-gc-warning)' }}
              >
                <FormattedMessage id="tree.filter.not-approved" values={{ sum: props.itemsSummary?.notExtractable }} />
              </Button>
            </Box>
          </Box>
          <Box style={treeTheme as React.CSSProperties} className="tree">
            <CatalogTree
              treeData={treeData as CatalogTreeNode[]}
              setTreeData={props.setCatalogTreeData}
              selectedNode={props.selectedItem as CatalogTreeNode}
              setSelectedNode={(item) => props.setSelectedItem?.(item)}
              updateNodeByProductName={updateNodeByProductName}
              handleRowClick={handleRowClick}
              onSelectedNode={handleSelectedItem}
            />
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
            <Terrain />
          </CesiumMap>
        </Box>
      </Box>
    </Box>
  );
};
