import appConfig from '../../utils/Config';
import { loadingUpdater } from '../../utils/loadingUpdater';
import { execute } from '../../utils/requestHandler';

export interface ExtractableResponse {
  nextRecord: number;
  numberOfRecords: number;
  numberOfRecordsReturned: number;
  records: ExtractableRecord[]
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
  setLoading: loadingUpdater
): Promise<ExtractableRecord | undefined> => {
  try {
    setLoading(true);
    const response = await execute(
      `${appConfig.extractableManagerUrl}/records/${recordName}`,
      'POST',
      {
        data: {
          username,
          password,
          authorizedBy,
          data,
        },
      }
    );
    return response as unknown as ExtractableRecord;
  } catch (error) {
    console.error('Failed to CREATE extractable record:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

export const extractableDeleteAPI = async (
  recordName: string,
  username: string,
  password: string,
  authorizedBy: string,
  data: Record<string, unknown>,
  setLoading: loadingUpdater
): Promise<string | undefined> => {
  try {
    setLoading(true);
    const response = await execute(
      `${appConfig.extractableManagerUrl}/records/${recordName}`,
      'DELETE',
      {
        data: {
          username,
          password,
          authorizedBy,
          data,
        },
      }
    );
    return response as string;
  } catch (error) {
    console.error('Failed to DELETE extractable record:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};
