import { CesiumResource } from '@map-colonies/react-components';
import appConfig from '../Config';

export const getTokenResource = (url: string): CesiumResource => {
  const tokenProps: any = { url };
  if (appConfig.tokenInjectionType && appConfig.tokenInjectionType.toLowerCase() === 'header') {
    tokenProps.headers = {
      [appConfig.tokenAttributeName]: appConfig.tokenValue
    };
  } else if (appConfig.tokenInjectionType && appConfig.tokenInjectionType.toLowerCase() === 'queryparam') {
    tokenProps.queryParameters = {
      [appConfig.tokenAttributeName]: appConfig.tokenValue
    };
  }
  return new CesiumResource(tokenProps);
};
