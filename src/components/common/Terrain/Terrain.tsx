import React, { useEffect } from 'react';
import {
  CesiumCesiumTerrainProvider,
  CesiumColor,
  CesiumEllipsoidTerrainProvider,
  useCesiumMap,
} from '@map-colonies/react-components';
import { getTokenResource } from '../../../utils/Cesium/CesiumResource';
import appConfig from '../../../utils/Config';

const NONE = 0;

export const Terrain: React.FC = () => {
  const mapViewer = useCesiumMap();

  mapViewer.scene.globe.depthTestAgainstTerrain = true;
  mapViewer.scene.globe.baseColor = CesiumColor.WHITESMOKE;

  useEffect(() => {
    function isTerrainTileError(e: Record<string, unknown>): boolean {
      return (e.level as number) > NONE;
    }

    function handleTerrainError(e: unknown): void {
      if (!isTerrainTileError(e as Record<string, unknown>)) {
        console.error('Terrain provider error: Falling back to default terrain.', e);
        mapViewer.terrainProvider.errorEvent.removeEventListener(handleTerrainError);
        mapViewer.terrainProvider = new CesiumEllipsoidTerrainProvider({});
      } else {
        console.error('Terrain provider error: Tile problem.', e);
      }
    }

    if (appConfig.defaultTerrainProviderUrl) {
      mapViewer.terrainProvider = new CesiumCesiumTerrainProvider({
        url: getTokenResource(appConfig.defaultTerrainProviderUrl),
      });
      mapViewer.terrainProvider.errorEvent.addEventListener(handleTerrainError);
    } else {
      mapViewer.terrainProvider = new CesiumEllipsoidTerrainProvider({});
    }
  }, []);

  return <></>;
};
