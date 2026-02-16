import { useEffect, useState } from "react";
import { CesiumColor, CesiumConstantProperty, CesiumGeojsonLayer, CesiumRectangle, RCesiumGeojsonLayerProps } from "@map-colonies/react-components";
import { FeatureCollection } from "geojson";
import { getLayerFootprint } from "../../../utils/Cesium/GetLayerFootprint";
import { FlyTo } from "../../../utils/Cesium/FlyTo";
import { FOOTPRINT_BORDER_WIDTH } from "../../../utils/Const";

interface CesiumGeojsonFootprintProps extends RCesiumGeojsonLayerProps {
  id: string;
  setFinishedFlying?: (finished: boolean) => void;
}

const FOOTPRINT_BORDER_COLOR = CesiumColor.DODGERBLUE;

export const CesiumGeojsonFootprint: React.FC<RCesiumGeojsonLayerProps & CesiumGeojsonFootprintProps> = (props) => {
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
  }, [props.id]);

  return (
    <>
      <CesiumGeojsonLayer
        {...props}
        data={layersFootprints}
        onLoad={(geoJsonDataSouce): void => {
          geoJsonDataSouce.entities.values.forEach(item => {
            if (item.polyline) {
              (item.polyline.width as CesiumConstantProperty).setValue(FOOTPRINT_BORDER_WIDTH);
              // typings issue in CESIUM for reference https://github.com/CesiumGS/cesium/issues/8898
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              item.polyline.material = FOOTPRINT_BORDER_COLOR;
            }
            if (item.polygon) {
              (item.polygon.outlineColor as CesiumConstantProperty).setValue(FOOTPRINT_BORDER_COLOR);
              // typings issue in CESIUM for reference https://github.com/CesiumGS/cesium/issues/8898
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              item.polygon.material = CesiumColor.fromRandom({ alpha: 0.4 });
            }
          });
        }}
      />
      {
        rect &&
        <FlyTo
          key={props.id}
          setRect={setRect}
          geometry={props.data}
          setFinishedFlying={props.setFinishedFlying}
        />
      }
    </>
  );
}