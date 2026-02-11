import { mockExtractableRecords } from '../../components/common/MockData';
import { createCatalogTree } from '../../components/common/Tree/TreeGroup';
import { IDENTIFIER_FIELD } from '../../components/Wizard/Wizard.types';
import appConfig from '../../utils/Config';
import { getRecordsXML, parseQueryResults } from '../../utils/cswQueryBuilder';
import { requestExecutor } from '../../utils/requestHandler';

const fetchData = async (url: string, method: 'GET' | 'POST', data?: Record<string, unknown>): Promise<Record<string, unknown>[] | string | undefined> => {
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
    console.error('Failed to fetch data:', error);
    return undefined;
  }
};

export const fetchCatalog = async () => {
  const data = getRecordsXML();
  const records = await fetchData(`${appConfig.csw3dUrl}`, 'POST', { data });
  if (typeof records !== 'string') {
    throw new Error('Failed to fetch records');
  }
  const parsed = parseQueryResults(records, 'mc:MC3DRecord') as Record<string, unknown>[];

  const extractableRecordsData = await fetchData(`${appConfig.extractableManagerUrl}/records}`, 'GET');
  // TODO: Remove mock data and handle the case when extractableRecordsData is undefined or not an array
  const extractableRecords = Array.isArray(extractableRecordsData) ? extractableRecordsData : mockExtractableRecords;

  const enriched = enrichRecords(parsed, extractableRecords);

  return {
    data: createCatalogTree(enriched),
    sumAll: parsed.length,
    sumExt: extractableRecords.length,
    sumNExt: parsed.length - extractableRecords.length
  };
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
