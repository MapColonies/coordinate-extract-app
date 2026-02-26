/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Feature, FeatureCollection, Geometry, Polygon, Position } from 'geojson';
import polygonToLine from '@turf/polygon-to-line';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import convex from '@turf/convex';

const shrinkExtremeCoordinatesInOuterRing = (geometry: Geometry, factor = 0.99) => {
  const LAT_THRESHOLD = 84.9;
  const LON_THRESHOLD = 179;

  function maybeShrink([lon, lat]: Position) {
    const needsShrink = Math.abs(lat) > LAT_THRESHOLD || Math.abs(lon) > LON_THRESHOLD;
    if (needsShrink) {
      return [lon * factor, lat * factor];
    }
    return [lon, lat];
  }

  function processRing(ring: Position[]) {
    const processed = ring.map(maybeShrink);

    // Ensure ring is closed
    const first = processed[0];
    const last = processed[processed.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      processed.push([...first]);
    }

    return processed;
  }

  if (geometry.type === 'Polygon') {
    const [outer, ...holes] = geometry.coordinates;
    return {
      type: 'Polygon',
      coordinates: [processRing(outer), ...holes],
    } as Geometry;
  }

  if (geometry.type === 'MultiPolygon') {
    return {
      type: 'MultiPolygon',
      coordinates: geometry.coordinates.map((polygon) => {
        const [outer, ...holes] = polygon;
        return [processRing(outer), ...holes];
      }),
    } as Geometry;
  }

  throw new Error(
    '[shrinkExtremeCoordinatesInOuterRing] Unsupported geometry type: ' + geometry.type
  );
};

export const getLayerFootprint = (
  layerFootprint: Geometry,
  isBbox: boolean,
  isPolylined = true,
  isConvexHull = false
): Feature | FeatureCollection => {
  if (layerFootprint === undefined) {
    return {
      type: 'Feature',
      // @ts-ignore
      geometry: null,
    };
  }

  if (isBbox) {
    let geometry = layerFootprint;
    switch (layerFootprint.type) {
      case 'MultiPolygon':
        geometry = (bboxPolygon(bbox(geometry)) as Feature).geometry;
        break;
      default:
        break;
    }

    if (isPolylined) {
      geometry = (polygonToLine(geometry as Polygon) as Feature).geometry;
    }

    return {
      type: 'Feature',
      geometry: {
        ...geometry,
      },
      properties: {},
    };
  } else {
    let geometry: Geometry = shrinkExtremeCoordinatesInOuterRing(layerFootprint, 0.999);
    if (isConvexHull) {
      // prettier-ignore
      // @ts-ignore
      geometry = isPolylined ? (polygonToLine(convex(geometry)) as Feature).geometry : (convex(geometry) as Feature).geometry;
      return {
        type: 'Feature',
        geometry: {
          ...geometry,
        },
        properties: {},
      };
    } else {
      if (isPolylined) {
        return {
          // @ts-ignore
          ...polygonToLine(geometry),
          properties: {},
        } as Feature;
      } else {
        return {
          type: 'Feature',
          geometry: {
            ...geometry,
          },
          properties: {},
        };
      }
    }
  }
};
