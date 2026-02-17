import { SnackbarManager } from '../../components/common/Snackbar/SnackbarManager';
import appConfig from '../../utils/Config';
import { loadingUpdater } from '../../utils/loadingUpdater';
import { requestExecutor } from '../../utils/requestHandler';
import { getSnackbarErrorMessage } from '../../utils/snackbarError';

type ExtractableResponse = {
  isValid: boolean,
  message: string,
  code: string
}

export interface ExtractableRecord {
  id: string;
  recordName: string;
  username: string;
  authorizedBy: string;
  authorizedAt: string;
  data: Record<string, unknown>;
}

export const extractableCreateAPI = async (
  recordName: string,
  username: string,
  password: string,
  authorizedBy: string,
  data: Record<string, unknown>,
  setLoading?: loadingUpdater,
  submitErrorToSnackbarQueue = true
): Promise<ExtractableRecord | undefined> => {
  try {
    setLoading?.(true);
    const response = await requestExecutor(
      {
        url: `${appConfig.extractableManagerUrl}/records/${recordName}`,
        injectToken: true
      },
      'POST',
      {
        data: {
          username,
          password,
          authorizedBy,
          data
        }
      }
    );
    return response?.data;
  } catch (error) {
    console.error('Failed to CREATE extractable record:', error);
    if (submitErrorToSnackbarQueue) {
      SnackbarManager.notify(
        getSnackbarErrorMessage((error as any).message as string)
      );
      throw error;
    }
  } finally {
    setLoading?.(false);
  }
};

export const extractableDeleteAPI = async (
  recordName: string,
  username: string,
  password: string,
  authorizedBy: string,
  data: Record<string, unknown>,
  setLoading?: loadingUpdater,
  submitErrorToSnackbarQueue = true
): Promise<void> => {
  try {
    setLoading?.(true);
    await requestExecutor(
      {
        url: `${appConfig.extractableManagerUrl}/records/${recordName}`,
        injectToken: true
      },
      'DELETE',
      {
        data: {
          username,
          password,
          authorizedBy,
          data
        }
      }
    );
  } catch (error) {
    console.error('Failed to DELETE extractable record:', error);
    if (submitErrorToSnackbarQueue) {
      SnackbarManager.notify(
        getSnackbarErrorMessage((error as any).message as string)
      );
      throw error;
    }
  } finally {
    setLoading?.(false);
  }
};
