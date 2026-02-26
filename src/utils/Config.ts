import {
  CesiumGeographicTilingScheme,
  IBaseMap,
  IBaseMaps,
  IRasterLayer,
} from '@map-colonies/react-components';
import { LinkType } from './Const';

const ACCESS_TOKEN_INJECTION_TYPE = (window as any)._env_.ACCESS_TOKEN_INJECTION_TYPE;
const ACCESS_TOKEN_ATTRIBUTE_NAME = (window as any)._env_.ACCESS_TOKEN_ATTRIBUTE_NAME;
const ACCESS_TOKEN_VALUE = (window as any)._env_.ACCESS_TOKEN_VALUE;
const PUBLIC_URL = (window as any)._env_.PUBLIC_URL;
const LANGUAGE = (window as any)._env_.LANGUAGE;
const MAP_CENTER = (window as any)._env_.MAP_CENTER;
const MAP_ZOOM = (window as any)._env_.MAP_ZOOM;
const BASE_MAPS = JSON.parse((window as any)._env_.BASE_MAPS);
const DEFAULT_TERRAIN_PROVIDER_URL = (window as any)._env_.DEFAULT_TERRAIN_PROVIDER_URL;
const CSW_3D_URL = (window as any)._env_.CSW_3D_URL;
const EXTRACTABLE_MANAGER_URL = (window as any)._env_.EXTRACTABLE_MANAGER_URL;
const SHOW_POI_TOOL = (window as any)._env_.SHOW_POI_TOOL;

const enrichBaseMaps = (baseMaps: IBaseMaps): IBaseMaps => {
  return {
    maps: baseMaps.maps.map((baseMap: IBaseMap) => {
      return {
        ...baseMap,
        baseRasterLayers: (baseMap.baseRasterLayers as IRasterLayer[]).map((rasterLayer) => {
          return {
            ...rasterLayer,
            options: {
              ...rasterLayer.options,
              tilingScheme:
                rasterLayer.type === LinkType.WMTS_LAYER
                  ? new CesiumGeographicTilingScheme()
                  : undefined,
            },
          };
        }),
      };
    }),
  };
};

class Config {
  public accessToken = {
    injectionType: ACCESS_TOKEN_INJECTION_TYPE,
    attributeName: ACCESS_TOKEN_ATTRIBUTE_NAME,
    tokenValue: ACCESS_TOKEN_VALUE,
  };
  public publicUrl = PUBLIC_URL || '.';
  public language = LANGUAGE || 'he';
  public mapCenter = MAP_CENTER || '[34.817, 31.911]';
  public mapZoom = MAP_ZOOM || '14';
  public baseMaps = enrichBaseMaps(BASE_MAPS);
  public defaultTerrainProviderUrl = DEFAULT_TERRAIN_PROVIDER_URL;
  public csw3dUrl = CSW_3D_URL;
  public extractableManagerUrl = EXTRACTABLE_MANAGER_URL;
  public showPOITool = SHOW_POI_TOOL;
}

const appConfig = new Config(); // Singleton

export default appConfig;
