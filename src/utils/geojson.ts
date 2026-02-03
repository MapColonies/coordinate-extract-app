import { Feature, GeoJsonProperties, Geometry, Position } from 'geojson';

const getFirstPoint = (geojson: Geometry): Position => {
  // @ts-ignore
  const { type, coordinates } = geojson;

  switch (type) {
    case "Point":
      return coordinates;

    case "LineString":
    case "MultiPoint":
      return coordinates[0];

    case "Polygon":
    case "MultiLineString":
      return coordinates[0][0];

    case "MultiPolygon":
      return coordinates[0][0][0];

    default:
      throw new Error("Unsupported GeoJSON geometry type");
  }
};

export const getMarker = (
  geometry: Geometry
): Feature<Geometry, GeoJsonProperties> => {
  return {
    type: "Feature",
    properties: {},
    geometry: {
      coordinates: getFirstPoint(geometry),
      type: "Point"
    },
  };
};

export const getFeatureAndMarker = (
  geometry: Geometry
): { feature: Feature<Geometry, GeoJsonProperties>, marker: Feature<Geometry, GeoJsonProperties> } => {
  const feature: Feature<Geometry> = {
    type: "Feature",
    properties: {},
    geometry
  };
  return {
    feature,
    marker: getMarker(geometry)
  };
};
