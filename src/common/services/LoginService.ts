import { mockLogin } from '../../components/common/MockData';
import appConfig from '../../utils/Config';
import { loadingUpdater } from '../../utils/loadingUpdater';
import { execute } from '../../utils/requestHandler';

interface LoginResponse {
  isValid: boolean;
  message: string;
  code: string;
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
          password
        },
        headers: {
          'Content-Type': 'application/json'
        }
      },
      false,
      false
    );
    return response as unknown as LoginResponse;
  } catch (error) {
    console.error('Failed to perform POST login:', error);
  } finally {
    setLoading(false);
    // TODO: REMOVE MOCK
    return mockLogin;
  }
};
