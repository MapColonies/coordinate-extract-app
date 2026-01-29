import React, { CSSProperties, useMemo } from 'react';
import { Feature } from 'geojson';
import { get } from 'lodash';
import { Style, Icon } from 'ol/style';
import type { Geometry as GeoJsonGeometry } from 'geojson';
import {
  Box,
  GeoJSONFeature,
  getWMTSOptions,
  getXYZOptions,
  IBaseMap,
  IRasterLayer,
  Map,
  TileLayer,
  TileWMTS,
  TileXYZ,
  VectorLayer,
  VectorSource
} from '@map-colonies/react-components';
import appConfig from '../../../utils/Config';
import { getMarker } from '../utils/utils';

import './GeojsonMap.css';

interface GeoFeaturesPresentorProps {
  geoFeatures?: Feature[];
  geometry?: GeoJsonGeometry;
  style?: CSSProperties | undefined;
}

export const GeojsonMap: React.FC<GeoFeaturesPresentorProps> = ({
  geometry,
  style
}) => {

  const DEFAULT_PROJECTION = 'EPSG:4326';

  const previewBaseMap = useMemo(() => {
    const olBaseMap: JSX.Element[] = [];
    let baseMap = appConfig.baseMaps.maps.find((map: IBaseMap) => map.isCurrent);
    if (!baseMap) {
      return;
    }
    if (baseMap) {
      baseMap.baseRasterLayers.forEach((layer: IRasterLayer) => {
        if (layer.type === 'WMTS_LAYER') {
          const wmtsOptions = getWMTSOptions({
            url: layer.options.url as string,
            layer: '',
            matrixSet: get(layer.options, 'tileMatrixSetID') as string,
            format: get(layer.options, 'format') as string,
            projection: DEFAULT_PROJECTION,
            style: get(layer.options, 'style') as string
          });
          olBaseMap.push(
            <TileLayer key={layer.id} options={{ opacity: layer.opacity }}>
              <TileWMTS options={{
                ...wmtsOptions,
                crossOrigin: 'anonymous'
              }} />
            </TileLayer>
          )
        }
        if (layer.type === 'XYZ_LAYER') {
          const xyzOptions = getXYZOptions({
            url: layer.options.url as string,
          });
          olBaseMap.push(
            <TileLayer key={layer.id} options={{ opacity: layer.opacity }}>
              <TileXYZ options={{
                ...xyzOptions,
                crossOrigin: 'anonymous'
              }} />
            </TileLayer>
          )
        }
      })
    }
    return olBaseMap;
  }, []);

  const pinGeometry = useMemo(() => {
    if (geometry) {
      return getMarker(geometry);
    }
  }, [geometry]);

  const renderFootprintInfo = () => {
    return (
      <Map>
        {previewBaseMap}
        {
          <VectorLayer>
            <VectorSource>
              {geometry &&
                <GeoJSONFeature
                  geometry={geometry as unknown as GeoJsonGeometry}
                  fit={false}
                />
              }
              {
                pinGeometry &&
                <GeoJSONFeature
                  geometry={pinGeometry as unknown as GeoJsonGeometry}
                  fit={false}
                  featureStyle={new Style({
                    image: new Icon({
                      scale: 0.2,
                      anchor: [0.5, 1],
                      src: 'assets/img/map-marker.png'
                    })
                  })}
                />
              }
            </VectorSource>
          </VectorLayer>
        }
      </Map>
    );
  };

  return (
    <Box className="geojsonMap" style={style}>
      {renderFootprintInfo()}
    </Box>
  );
};
