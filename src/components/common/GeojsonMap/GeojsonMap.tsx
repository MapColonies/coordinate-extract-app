import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
import { Geometry as GeoJsonGeometry } from 'geojson';
import { get } from 'lodash';
import { Style, Icon, Stroke, Fill } from 'ol/style';
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
  VectorSource,
} from '@map-colonies/react-components';
import { Curtain } from '../../../common/Curtain/curtain';
import appConfig from '../../../utils/Config';
import {
  DEFAULT_PROJECTION,
  FOOTPRINT_BORDER_COLOR,
  FOOTPRINT_BORDER_WIDTH,
} from '../../../utils/Const';
import { getMarker } from '../../../utils/geojson';

import './GeojsonMap.css';

interface GeoFeaturesPresentorProps {
  geometry?: GeoJsonGeometry;
  style?: CSSProperties | undefined;
}

export const GeojsonMap: React.FC<GeoFeaturesPresentorProps> = ({ geometry, style }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [fit, setFit] = useState<boolean>();

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
            style: get(layer.options, 'style') as string,
          });
          olBaseMap.push(
            <TileLayer key={layer.id} options={{ opacity: layer.opacity }}>
              <TileWMTS
                options={{
                  ...wmtsOptions,
                  crossOrigin: 'anonymous',
                }}
              />
            </TileLayer>
          );
        }
        if (layer.type === 'XYZ_LAYER') {
          const xyzOptions = getXYZOptions({
            url: layer.options.url as string,
          });
          olBaseMap.push(
            <TileLayer key={layer.id} options={{ opacity: layer.opacity }}>
              <TileXYZ
                options={{
                  ...xyzOptions,
                  crossOrigin: 'anonymous',
                }}
              />
            </TileLayer>
          );
        }
      });
    }
    return olBaseMap;
  }, []);

  const pinGeometry = useMemo(() => {
    if (geometry) {
      return getMarker(geometry);
    }
  }, [geometry]);

  useEffect(() => {
    // setTimeout is used to give proper UI/UX experience
    setTimeout(() => {
      setFit(true);
      setIsLoading(false);
    }, 1000);
  }, [geometry]);

  const renderFootprintInfo = () => {
    return (
      <Map>
        {previewBaseMap}
        {
          <VectorLayer>
            <VectorSource>
              {geometry && (
                <GeoJSONFeature
                  geometry={geometry as unknown as GeoJsonGeometry}
                  fit={fit}
                  fitOptions={{ padding: [80, 160, 80, 160] }}
                  featureStyle={
                    new Style({
                      stroke: new Stroke({
                        width: FOOTPRINT_BORDER_WIDTH,
                        color: FOOTPRINT_BORDER_COLOR,
                      }),
                      fill: new Fill({
                        color: 'rgba(255,255,255,0.3)',
                      }),
                    })
                  }
                />
              )}
              {pinGeometry && (
                <GeoJSONFeature
                  geometry={pinGeometry as unknown as GeoJsonGeometry}
                  fit={false}
                  featureStyle={
                    new Style({
                      image: new Icon({
                        scale: 0.2,
                        anchor: [0.5, 1],
                        src: 'assets/img/map-marker.png',
                      }),
                    })
                  }
                />
              )}
            </VectorSource>
          </VectorLayer>
        }
      </Map>
    );
  };

  return (
    <Box className="geojsonMap curtainContainer" style={style}>
      {isLoading && <Curtain showProgress={true} />}
      {renderFootprintInfo()}
    </Box>
  );
};
