import { mockExtractableRecords } from '../../components/common/MockData';
import { createCatalogTree } from '../../components/common/Tree/TreeGroup';
import { IDENTIFIER_FIELD } from '../../components/Wizard/Wizard.types';
import appConfig from '../../utils/Config';
import { get3DRecordsXML, parse3DQueryResults } from '../../utils/cswQueryBuilder';
import { loadingUpdater } from '../../utils/loadingUpdater';
import { execute } from '../../utils/requestHandler';

export const fetchCatalog = async (setLoading: loadingUpdater) => {
  let parsed, extractables;
  try {
    setLoading(true);
    const data = get3DRecordsXML();
    const records = await execute(
      `${appConfig.csw3dUrl}`,
      'POST',
      { data }
    );
    parsed = parse3DQueryResults(records as string) as Record<string, unknown>[];
    extractables = await execute(
      `${appConfig.extractableManagerUrl}/records?startPosition=1&maxRecords=1000`,
      'GET',
      undefined, false // TODO: REMOVE when token handling is implemented
    );
  } catch (error) {
    console.error('Failed to fetch catalog/extractable data:', error);
  } finally {
    const catalogRecords = Array.isArray(parsed) ? parsed : [];
    // TODO: REMOVE MOCK
    const extractableRecords = Array.isArray(extractables) ? extractables : mockExtractableRecords;// [];
    const enriched = enrichRecords(catalogRecords, extractableRecords);
    setLoading(false);
    return {
      data: createCatalogTree(enriched),
      sumAll: catalogRecords.length,
      sumExtractable: catalogRecords.length > 0 ? extractableRecords.length : catalogRecords.length,
      sumNotExtractable: catalogRecords.length > 0 ? catalogRecords.length - extractableRecords.length : catalogRecords.length
    };
  }
};

const enrichRecords = (
  records: Record<string, unknown>[],
  extractables: Record<string, unknown>[]
): Record<string, unknown>[] => {
  const extractableById = new Map(
    extractables.map((e) => [e.recordName as string, e])
  );
  return records.map((record) => {
    const id = record[IDENTIFIER_FIELD] as string;
    const matched = extractableById.get(id);
    return {
      ...record,
      isApproved: Boolean(matched),
      isShown: false,
      extractable: matched
    };
  });
};
