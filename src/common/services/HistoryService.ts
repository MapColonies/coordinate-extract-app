import { mockHistory } from '../../components/common/MockData';
import appConfig from '../../utils/Config';
import { requestExecutor } from '../../utils/requestHandler';
import { SnackbarManager } from '../../components/common/SnackBar/SnackbarManager';
import { getSnackbarErrorMessage } from './SnackError';
import { loadingUpdater } from './loadingUpdater';

export interface HistoryRecord {
  id: string;
  recordName: string;
  username: string;
  authorizedBy: string;
  action: string;
  authorizedAt: string;
}

export const historyAPI = async (recordName: string, setLoading?: loadingUpdater, submitErrorToSnackbarQueue = true ): Promise<HistoryRecord[] | undefined> => {
  try {
    setLoading?.(true);
    const response = await requestExecutor(
      {
        url: `${appConfig.extractableManagerUrl}/audit/${recordName}`,
        injectToken: true
      },
      'GET',
      {}
    );
    return response?.data;
  } catch (error) {
    console.error('Failed to perform GET history:', error);
    if (submitErrorToSnackbarQueue) {
      SnackbarManager.notify(
        getSnackbarErrorMessage((error as any).message as string)
      );
      //TODO: REMOVE MOCK
      return mockHistory;
      // throw error;
    } else {
      //TODO: REMOVE MOCK
      return mockHistory;
      // throw error;
    }
  } finally {
    setLoading?.(false);
  }
};

