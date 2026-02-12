import { CesiumResource } from '@map-colonies/react-components';
import appConfig from '../Config';

export const getTokenResource = (url: string): CesiumResource => {
  const tokenProps: any = { url };
  const { injectionType, attributeName, tokenValue } = appConfig.accessToken;
  if (injectionType && injectionType.toLowerCase() === 'header') {
    tokenProps.headers = {
      [attributeName]: tokenValue
    };
  } else if (injectionType && injectionType.toLowerCase() === 'queryparam') {
    tokenProps.queryParameters = {
      [attributeName]: tokenValue
    };
  }
  return new CesiumResource(tokenProps);
};
