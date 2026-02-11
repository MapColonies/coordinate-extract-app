import React, { useEffect } from 'react';
import { CesiumColor, CesiumRectangle, useCesiumMap } from '@map-colonies/react-components';
import bbox from '@turf/bbox';
import { Geometry } from 'geojson';

const TRANSPARENT = 0.0;

interface FlyToProps {
  setRect: (rect: CesiumRectangle | undefined) => void;
  geometry: Geometry;
  tilt?: boolean;
}

export const generateLayerRectangle = (geometry: Geometry): CesiumRectangle => {
  // eslint-disable-next-line
  return CesiumRectangle.fromDegrees(...bbox(geometry)) as CesiumRectangle;
};

export const FlyTo: React.FC<FlyToProps> = ({ setRect, geometry, tilt = false }): JSX.Element => {
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

    void mapViewer.flyTo(
      rectangle, !tilt ? {
        offset: {
          heading: 0,
          pitch: -Math.PI / 2,
          range: 0
        }
      } : {}
    ).then(() => {
      mapViewer.entities.remove(rectangle);
    });

    setRect(undefined);
  }, []);

  return <></>;
};
