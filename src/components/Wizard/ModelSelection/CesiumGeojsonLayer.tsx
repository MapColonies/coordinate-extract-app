import { useEffect, useState } from "react";
import { CesiumGeojsonLayer, CesiumRectangle, RCesiumGeojsonLayerProps } from "@map-colonies/react-components";
import { FeatureCollection } from "geojson";
import { getLayerFootprint } from "../../../utils/GetLayerFootprint";
import { FlyTo } from "../../../utils/fly-to";

export const CesiumGeojsonFootprint: React.FC<RCesiumGeojsonLayerProps> = (props) => {
  const [layersFootprints, setlayersFootprints] = useState<FeatureCollection>();
  const [rect, setRect] = useState<CesiumRectangle | undefined>(undefined);

  useEffect(() => {
    let footprintsCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: []
    };
    const layer = props.data;
    if (layer) {
      const footprint = getLayerFootprint(layer, false, true);
      if (footprint.type !== 'FeatureCollection') {
        footprintsCollection.features.push(footprint);
      } else {
        footprintsCollection = footprint;
      }
    }
    setlayersFootprints(footprintsCollection);
    setRect(new CesiumRectangle());
  }, [props.data]);

  return (
    <>
      <CesiumGeojsonLayer
        {...props}
        data={layersFootprints}
      />
      {rect && <FlyTo setRect={setRect} geometry={props.data} />}
    </>
  );
}