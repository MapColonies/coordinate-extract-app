import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import {
  CesiumCartesian3,
  CesiumCartographic,
  CesiumColor,
  CesiumEntity,
  CesiumHeightReference,
  cesiumSampleTerrainMostDetailed,
  CesiumVerticalOrigin,
  useCesiumMap
} from '@map-colonies/react-components';
import { FlyTo } from './FlyTo';

interface PoiEntityProps {
  longitude: number;
  latitude: number;
}

// export interface IPOI {
//   lon: number;
//   lat: number;
// }

export const LocationMarker: React.FC<PoiEntityProps> = ({ longitude, latitude }) => {
  // const longitude = 52.01053;
  // const latitude = 36.50835;
  // const intl = useIntl();
  const mapViewer = useCesiumMap();
  const [position, setPosition] = useState<CesiumCartesian3 | undefined>();
  // const [height, setHeight] = useState<number>(DEFAULT_HEIGHT);

  useEffect(() => {
    // setTimeout(() => {
    if (!mapViewer) return;

    const cartographic = CesiumCartographic.fromDegrees(longitude, latitude);
    const height = mapViewer.scene.sampleHeight(cartographic);

    console.log('height', height)
    const finalHeight = height || 0;

    setPosition(
      CesiumCartesian3.fromDegrees(longitude, latitude, finalHeight)
    );
    // }, 20000);
  }, [mapViewer, latitude, longitude]);

  return (
    <>
      {
        position !== undefined &&
        <CesiumEntity
          // name={intl.formatMessage({ id: 'poi.dialog.description.title' })}
          position={position}
          billboard={{
            verticalOrigin: CesiumVerticalOrigin.BOTTOM,
            scale: 0.5,
            image: 'assets/img/map-marker.gif',
          }}
        // point={{
        //   pixelSize: 24,
        //   //@ts-ignore
        //   // image: 'assets/img/map-marker.gif',
        //   outlineColor: CesiumColor.RED,
        //   outlineWidth: 2,
        //   // heightReference: CesiumHeightReference.CLAMP_TO_GROUND,
        // }}
        //   description={`
        //   ${intl.formatMessage({ id: 'poi.dialog.description.longitude' }, { value: longitude })}</br>
        //   ${intl.formatMessage({ id: 'poi.dialog.description.latitude' }, { value: latitude })}</br>
        //   ${intl.formatMessage({ id: 'poi.dialog.description.height' }, { value: height })}
        // `}
        />
      }
    </>
  );
};