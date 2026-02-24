import { useEffect, useState } from 'react';
import { CesiumCartographic, cesiumSampleTerrainMostDetailed, useCesiumMap } from '@map-colonies/react-components';
import { isEmpty } from 'lodash';

interface UseCesiumHeightParams {
  lon?: number;
  lat?: number;
  enabled?: boolean;
  setEnabled?: (val: boolean) => void;
}

export const useCesiumHeight = (params: UseCesiumHeightParams) => {
  const mapViewer = useCesiumMap();
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const { lon, lat } = params;

    if (!mapViewer || lon === undefined || lat === undefined || !params.enabled) {
      return;
    }

    let cancelled = false;
    const scene = mapViewer.scene;

    const updateHeight = async () => {
      const cartographic = CesiumCartographic.fromDegrees(lon, lat);
      let sampledHeight: number | undefined;

      // TODO: ONLY ONE model on scene
      const tileset = scene.primitives.get(1);

      if (tileset) {
        await tileset.readyPromise;

        // Extra wait until refinement stabilizes
        await new Promise(resolve => {
          scene.postRender.addEventListener(function check() {
            // TODO: Private access
            if (!tileset._statistics?.numberOfPendingRequests) {
              scene.postRender.removeEventListener(check);
              resolve(null);
            }
          });
        });

        // sampleHeightMostDetailed works on RENDERED materials, here we are waiting only on the 3DTileset to be fully loaded
        const updated = await scene.sampleHeightMostDetailed([cartographic]);
        sampledHeight = updated[0].height;
      } else {
        // cesiumSampleTerrainMostDetailed makes EXTRA REQUEST if needed
        const updatedPositions = await cesiumSampleTerrainMostDetailed(
          mapViewer.terrainProvider,
          [cartographic]
        );

        if (!isEmpty(updatedPositions)) {
          sampledHeight = updatedPositions[0].height;
        }
      }

      if (!cancelled && sampledHeight !== undefined) {
        setHeight(sampledHeight);
        params.setEnabled?.(false);
      }
    };

    updateHeight();

    return () => {
      cancelled = true;
    };
  }, [mapViewer, params.lon, params.lat, params.enabled]);

  return {
    height,
    resetHeight: () => {
      setHeight(undefined);
    }
  };
};
