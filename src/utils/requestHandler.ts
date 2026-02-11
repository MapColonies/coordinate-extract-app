import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import appConfig from './Config';

interface IResource {
  url: string;
  injectToken: boolean;
}

const isHeader = (injectionType: string): boolean => {
  return injectionType.toLowerCase() === 'header';
};

const isQueryParam = (injectionType: string): boolean => {
  return injectionType.toLowerCase() === 'queryparam';
};

export const requestExecutor = async (service: IResource, method: string, params: AxiosRequestConfig): Promise<AxiosResponse> => {
  return service.injectToken
    ? requestHandlerWithToken(service.url, method, params)
    : requestHandler(service.url, method, params);
};

export const requestHandler = async (url: string, method: string, params: AxiosRequestConfig): Promise<AxiosResponse> => {
  const requestConfig: AxiosRequestConfig = {
    url,
    method: method as Method,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    ...params,
    headers: {
      ...{
        ...(params.headers ?? {}),
      },
    } as Record<string, unknown>,
  };

  return axios
    .request(requestConfig)
    .then((res) => res)
    .catch((error) => {
      //TODO: Create custom ERROR object
      throw error;
    });
};

export const requestHandlerWithToken = async (url: string, method: string, params: AxiosRequestConfig): Promise<AxiosResponse> => {
  const injectionType = appConfig.tokenInjectionType;
  const attributeName = appConfig.tokenAttributeName;
  const tokenValue = appConfig.tokenValue;
  const reqConfig = { ...params };

  if (isHeader(injectionType)) {
    reqConfig.headers = {
      ...reqConfig.headers,
      [attributeName]: tokenValue,
    } as Record<string, unknown>;
  } else if (isQueryParam(injectionType)) {
    reqConfig.params = {
      ...reqConfig.params,
      [attributeName]: tokenValue,
    } as Record<string, unknown>;
  }

  return requestHandler(url, method, reqConfig);
};
