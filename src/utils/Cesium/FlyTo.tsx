import React, { useEffect } from 'react';
import { CesiumCartesian3, CesiumCartographic, CesiumColor, CesiumMath, CesiumRectangle, useCesiumMap } from '@map-colonies/react-components';
import bbox from '@turf/bbox';
import { Geometry } from 'geojson';

const TRANSPARENT = 0.0;

interface FlyToProps {
  geometry: Geometry;
  tilt?: boolean;
  onFinishedFlying?: (finished: boolean) => void;
  animation?: boolean;
}

export const cartesian2geometry = (cartesian: CesiumCartesian3): Geometry => {
  const cartographic = CesiumCartographic.fromCartesian(cartesian);
  const longitude = CesiumMath.toDegrees(cartographic.longitude);
  const latitude = CesiumMath.toDegrees(cartographic.latitude);
  const height = cartographic.height;

  return coordinate2cartesian(longitude, latitude, height);
}

export const coordinate2cartesian = (longitude: number, latitude: number, height: number): Geometry => {
  return {
    type: 'Point',
    coordinates: [longitude, latitude, height]
  };
}

export const lonLat2cartesian = (longitude: number, latitude: number): Geometry => {
  return {
    type: 'Point',
    coordinates: [longitude, latitude]
  };
}

export const generateLayerRectangle = (geometry: Geometry): CesiumRectangle => {
  return CesiumRectangle.fromDegrees(...bbox(geometry)) as CesiumRectangle;
};

export const FlyTo: React.FC<FlyToProps> = ({ geometry, onFinishedFlying, animation = true, tilt = false }): JSX.Element => {
  const mapViewer = useCesiumMap();
  let rect;

  useEffect(() => {
    rect = generateLayerRectangle(geometry);

    const rectangle = mapViewer.entities.add({
      rectangle: {
        coordinates: rect,
        material: CesiumColor.PURPLE.withAlpha(TRANSPARENT)
      },
    });

    onFinishedFlying?.(false);

    mapViewer.flyTo(
      rectangle,
      !tilt ? {
        offset: {
          heading: 0,
          pitch: -Math.PI / 2,
          range: 0
        },
        duration: animation ? undefined : 0
      } : {}
    ).then(() => {
      onFinishedFlying?.(true);
    });
  }, [geometry]);

  return <></>;
};
