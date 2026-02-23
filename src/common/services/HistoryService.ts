import { mockHistory } from '../../components/common/MockData';
import appConfig from '../../utils/Config';
import { loadingUpdater } from '../../utils/loadingUpdater';
import { execute } from '../../utils/requestHandler';

export interface HistoryRecord {
  id: string;
  recordName: string;
  username: string;
  authorizedBy: string;
  action: string;
  authorizedAt: string;
}

export const historyAPI = async (
  recordName: string,
  setLoading: loadingUpdater
): Promise<HistoryRecord[] | undefined> => {
  try {
    setLoading(true);
    const response = await execute(
      `${appConfig.extractableManagerUrl}/audit/${recordName}`,
      'GET',
      undefined, false // TODO: REMOVE when token handling is implemented
    );
    return response as unknown as HistoryRecord[];
  } catch (error) {
    console.error('Failed to perform GET history:', error);
  } finally {
    setLoading(false);
    // TODO: REMOVE MOCK
    return mockHistory;
  }
};
