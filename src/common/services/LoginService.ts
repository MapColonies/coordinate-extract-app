import { get } from 'lodash';
import appConfig from '../../utils/Config';
import { loadingUpdater } from '../../utils/loadingUpdater';
import { execute } from '../../utils/requestHandler';

interface LoginResponse {
  message: string;
  isValid?: boolean;
  code?: string;
}

export const loginAPI = async (
  username: string,
  password: string,
  setLoading: loadingUpdater
): Promise<LoginResponse | undefined> => {
  try {
    setLoading(true);
    const response = await execute(
      `${appConfig.extractableManagerUrl}/users/validate`,
      'POST',
      {
        data: {
          username,
          password,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
      true,
      false
    );
    return response as unknown as LoginResponse;
  } catch (error: any) {
    const respData = get(error, 'response.data');
    if (respData) {
      return respData;
    } else {
      console.error('Failed to perform POST login:', error);
      return { message: error.message };
    }
  } finally {
    setLoading(false);
  }
};
