import React, { useEffect, useState } from 'react';
import {
  CesiumCartesian3,
  CesiumEntity,
  CesiumVerticalOrigin,
  useCesiumMap
} from '@map-colonies/react-components';
import { cartesian2geometry, FlyTo } from './FlyTo';

interface IPOI {
  longitude: number;
  latitude: number;
  height?: number;
}

export const LocationMarker: React.FC<IPOI> = (props) => {
  const mapViewer = useCesiumMap();
  const [position, setPosition] = useState<CesiumCartesian3 | undefined>();

  useEffect(() => {
    if (!mapViewer) return;
    const finalPosition = CesiumCartesian3.fromDegrees(props.longitude, props.latitude, props.height);
    setPosition(finalPosition);
  }, [mapViewer, props.latitude, props.longitude, props.height]);

  return (
    <>
      {
        position !== undefined &&
        <CesiumEntity
          position={position}
          billboard={{
            verticalOrigin: CesiumVerticalOrigin.BOTTOM,
            scale: 0.5,
            image: 'assets/img/map-marker.gif',
          }}
        />
      }
      {
        position !== undefined &&
        <FlyTo
          geometry={cartesian2geometry(position)}
          animation={false}
        />
      }
    </>
  );
};