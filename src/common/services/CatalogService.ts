import { mockExtractableRecords } from '../../components/common/MockData';
import { SnackbarManager } from '../../components/common/SnackBar/SnackbarManager';
import { createCatalogTree } from '../../components/common/Tree/TreeGroup';
import { IDENTIFIER_FIELD } from '../../components/Wizard/Wizard.types';
import appConfig from '../../utils/Config';
import { get3DRecordsXML, parse3DQueryResults } from '../../utils/cswQueryBuilder';
import { requestExecutor } from '../../utils/requestHandler';
import { loadingUpdater } from './loadingUpdater';
import { getSnackbarErrorMessage } from './SnackError';

const fetchData = async (url: string, method: 'GET' | 'POST', data?: Record<string, unknown>, setLoading?: loadingUpdater, submitErrorToSnackbarQueue = true): Promise<Record<string, unknown>[] | string | undefined> => {
  try {
    const response = await requestExecutor(
      {
        url,
        injectToken: true
      },
      method,
      {
        ...(data ?? {}),
      }
    );
    return response?.data;
  } catch (error) {
    console.error('Failed to FETCH 3D catalog:', error);
    if (submitErrorToSnackbarQueue) {
      SnackbarManager.notify(
        getSnackbarErrorMessage((error as any).message as string)
      );
    }
    throw error;
  } finally {
    setLoading?.(false);
  }
};

export const fetchCatalog = async (setLoading?: loadingUpdater, submitErrorToSnackbarQueue = true) => {
  const data = get3DRecordsXML();
  const records = await fetchData(`${appConfig.csw3dUrl}`, 'POST', { data }, setLoading, submitErrorToSnackbarQueue);
  const parsed = parse3DQueryResults(records as string) as Record<string, unknown>[];

  let extractableRecordsData, extractableRecords;
  try {
    extractableRecordsData = await fetchData(`${appConfig.extractableManagerUrl}/records}`, 'GET', undefined, setLoading, submitErrorToSnackbarQueue);
  } catch (error) { }
  finally {
    //TODO: REMOVE MOCK data and handle the case when extractableRecordsData is undefined or not an array
    extractableRecords = Array.isArray(extractableRecordsData) ? extractableRecordsData : mockExtractableRecords;

    const enriched = enrichRecords(parsed, extractableRecords);
    return {
      data: createCatalogTree(enriched),
      sumAll: parsed.length,
      sumExt: extractableRecords.length,
      sumNExt: parsed.length - extractableRecords.length
    };
  }
};

const enrichRecords = (
  records: Record<string, unknown>[],
  extractableFields: Record<string, unknown>[]
): Record<string, unknown>[] => {
  const extractableFieldsByName = new Map(
    extractableFields.map((e) => [e.recordName as string, e])
  );
  return records.map((record) => {
    const recordName = record[IDENTIFIER_FIELD] as string;
    const matchedExtraField = extractableFieldsByName.get(recordName);
    return {
      ...record,
      isApproved: Boolean(matchedExtraField),
      isShown: false,
      extractable: matchedExtraField ?? null
    };
  });
};
