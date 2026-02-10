import { mockLogin } from '../../components/common/MockData';
import appConfig from '../../utils/Config';
import { requestExecutor } from '../../utils/requestHandler';
import { SnackbarManager } from '../../components/common/SnackBar/SnackbarManager';
import { getSnackbarErrorMessage } from './SnackError';

type loadingUpdater = (value: boolean) => void;
type loginResponse = {
  isValid: boolean,
  message: string,
  code: string
}

export const loginAPI = async (username: string, password: string, setLoading?: loadingUpdater, submitErrorToSnackbarQueue = true ): Promise<loginResponse | undefined> => {
  try {
    setLoading?.(true);
    const response = await requestExecutor({
      url: `${appConfig.extractableManagerUrl}/users/validate`,
      injectToken: true
    }, 'POST', {
      data: {
        username: username,
        password: password
      }
    });
    return (response?.data || mockLogin);
  } catch (error) {
    console.error('Failed to perform login:', error);
    if(submitErrorToSnackbarQueue){
      SnackbarManager.notify(
        getSnackbarErrorMessage((error as any).message as string)
      );
    }
    else{
      //TODO: REMOVE MOCK
      return mockLogin;
      // throw error;
    }
  } finally {
    setLoading?.(false);
  }
};

