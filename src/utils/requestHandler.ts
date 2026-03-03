import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios';
import { get } from 'lodash';
import { SnackbarManager } from '../components/common/Snackbar/SnackbarManager';
import appConfig from './Config';
import { getSnackbarErrorMessage } from './snackbarError';

interface IResource {
  url: string;
  injectToken: boolean;
}

//Axios Instance (Global)
const api = axios.create({
  timeout: 30000,
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
});

//response interceptor for centralized logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

const isHeader = (injectionType: string): boolean => {
  return injectionType.toLowerCase() === 'header';
};

const isQueryParam = (injectionType: string): boolean => {
  return injectionType.toLowerCase() === 'queryparam';
};

export const requestExecutor = async (
  service: IResource,
  method: string,
  params: AxiosRequestConfig
): Promise<AxiosResponse> => {
  return service.injectToken
    ? requestHandlerWithToken(service.url, method, params)
    : requestHandler(service.url, method, params);
};

export const requestHandler = async (
  url: string,
  method: string,
  params: AxiosRequestConfig
): Promise<AxiosResponse> => {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 30000);

  const requestConfig: AxiosRequestConfig = {
    url,
    method: method as Method,
    ...params,
    //@ts-ignore
    signal: controller.signal,
    headers: {
      ...(params.headers ?? {}),
    },
  };

  try {
    const response = await api.request(requestConfig);
    return response;
  } catch (error) {
    //TODO: Create custom ERROR object
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const requestHandlerWithToken = async (
  url: string,
  method: string,
  params: AxiosRequestConfig
): Promise<AxiosResponse> => {
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
  injectToken = true,
  submitErrorToSnackbarQueue = true
): Promise<Record<string, unknown>[] | string | undefined> => {
  try {
    const response = await requestExecutor(
      {
        url,
        injectToken,
      },
      method,
      {
        ...(data ?? {}),
      }
    );
    return response?.status === 204 ? 'OK' : response?.data;
  } catch (error) {
    if (submitErrorToSnackbarQueue) {
      const respData = get(error, 'response.data');
      let errText = (error as any).message;
      if (respData?.code) {
        errText = `err.code.${respData.code}`;
      }
      SnackbarManager.notify(getSnackbarErrorMessage(errText, respData?.code ? true : false));
    }
    throw error;
  }
};
