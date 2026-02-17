import { useEffect, useState } from "react";
import { CesiumGeojsonLayer, RCesiumGeojsonLayerProps } from "@map-colonies/react-components";
import { FeatureCollection } from "geojson";
import { getLayerFootprint } from "../../../utils/Cesium/GetLayerFootprint";
import { FlyTo } from "../../../utils/Cesium/FlyTo";

interface CesiumGeojsonFootprintProps extends RCesiumGeojsonLayerProps {
  id: string;
  setFinishedFlying?: (finished: boolean) => void;
}

export const CesiumGeojsonFootprint: React.FC<RCesiumGeojsonLayerProps & CesiumGeojsonFootprintProps> = (props) => {
  const [layersFootprints, setlayersFootprints] = useState<FeatureCollection>();
  const [flyTo, setFlyTo] = useState<boolean>(false);

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
    setFlyTo(true);
  }, [props.id]);

  return (
    <>
      <CesiumGeojsonLayer
        {...props}
        data={layersFootprints}
      />
      {
        flyTo &&
        <FlyTo
          key={props.id}
          geometry={props.data}
          setFinishedFlying={props.setFinishedFlying}
        />
      }
    </>
  );
}