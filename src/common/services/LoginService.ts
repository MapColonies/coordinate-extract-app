import { mockLogin } from '../../components/common/MockData';
import { SnackbarManager } from '../../components/common/Snackbar/SnackbarManager';
import appConfig from '../../utils/Config';
import { loadingUpdater } from '../../utils/loadingUpdater';
import { requestExecutor } from '../../utils/requestHandler';
import { getSnackbarErrorMessage } from '../../utils/snackbarError';

interface LoginResponse {
  isValid: boolean;
  message: string;
  code: string;
}

export const loginAPI = async (
  username: string,
  password: string,
  setLoading?: loadingUpdater,
  submitErrorToSnackbarQueue = true
): Promise<LoginResponse | undefined> => {
  try {
    setLoading?.(true);
    const response = await requestExecutor(
      {
        url: `${appConfig.extractableManagerUrl}/users/validate`,
        injectToken: true
      },
      'POST',
      {
        data: {
          username: username,
          password: password
        }
      }
    );
    return response?.data;
  } catch (error) {
    console.error('Failed to perform POST login:', error);
    if (submitErrorToSnackbarQueue) {
      SnackbarManager.notify(
        getSnackbarErrorMessage((error as any).message as string)
      );
      throw error;
    } else {
      //TODO: REMOVE MOCK
      return mockLogin;
      // throw error;
    }
  } finally {
    setLoading?.(false);
  }
};
