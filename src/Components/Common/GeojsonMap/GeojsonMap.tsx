import React, { CSSProperties, useMemo } from 'react';
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
import { get } from 'lodash';
import { Style, Icon } from 'ol/style';
import { Feature } from 'geojson';
import type { Geometry as GeoJsonGeometry } from 'geojson';
import { getMarker } from '../utils/utils';

import './GeojsonMap.css';


interface GeoFeaturesPresentorProps {
  geoFeatures?: Feature[];
  geometry?: GeoJsonGeometry;
  style?: CSSProperties | undefined;
}


export const GeoJsonMapComponent: React.FC<GeoFeaturesPresentorProps> = ({
  geometry,
  style
}) => {

  const DEFAULT_PROJECTION = 'EPSG:4326';

  const previewBaseMap = useMemo(() => {
    const olBaseMap = new Array();
    let baseMap: IBaseMap = JSON.parse('{"maps":[{"id":"1st","title":"1st Map","isForPreview":true,"thumbnail":"https://mt1.google.com/vt/lyrs=s&x=6&y=4&z=3","baseRasterLayers":[{"id":"GOOGLE_TERRAIN","type":"XYZ_LAYER","opacity":1,"zIndex":0,"options":{"url":"https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}","layers":"","credit":"GOOGLE"}},{"id":"INFRARED_RASTER","type":"WMS_LAYER","opacity":0.6,"zIndex":1,"options":{"url":"https://mesonet.agron.iastate.edu/cgi-bin/wms/goes/conus_ir.cgi?","layers":"goes_conus_ir","credit":"Infrared data courtesy Iowa Environmental Mesonet","parameters":{"transparent":"true","format":"image/png"}}}]}]}').maps.find((map: IBaseMap) => map.isForPreview);
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
    // if (!geometry) {
    //   return <Box className="map-placeholder">Select a catalog item to view its footprint and details</Box>;
    // }

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
    <Box className="geojson-map-component" style={style}>
      {renderFootprintInfo()}
    </Box>
  );
};
