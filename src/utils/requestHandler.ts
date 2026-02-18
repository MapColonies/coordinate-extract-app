import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { SnackbarManager } from '../components/common/Snackbar/SnackbarManager';
import appConfig from './Config';
import { getSnackbarErrorMessage } from './snackbarError';

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
  const { injectionType, attributeName, tokenValue } = appConfig.accessToken;
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

export const execute = async (
  url: string,
  method: 'GET' | 'POST' | 'DELETE',
  data?: Record<string, unknown>,
  submitErrorToSnackbarQueue = true
): Promise<Record<string, unknown>[] | string | undefined> => {
  try {
    const response = await requestExecutor(
      {
        url,
        injectToken: true
      },
      method,
      {
        ...(data ?? {})
      }
    );
    return response?.status === 204 ? 'OK' : response?.data;
  } catch (error) {
    if (submitErrorToSnackbarQueue) {
      SnackbarManager.notify(getSnackbarErrorMessage((error as any).message as string));
    }
    throw error;
  }
};
