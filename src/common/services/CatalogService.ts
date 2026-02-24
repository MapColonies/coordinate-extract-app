import { createCatalogTree } from '../../components/common/Tree/TreeGroup';
import { IDENTIFIER_FIELD } from '../../components/Wizard/Wizard.types';
import appConfig from '../../utils/Config';
import { get3DRecordsXML, parse3DQueryResults } from '../../utils/cswQueryBuilder';
import { loadingUpdater } from '../../utils/loadingUpdater';
import { execute } from '../../utils/requestHandler';
import { ExtractableRecord } from './ExtractableService';

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
      'GET'
    );
  } catch (error) {
    console.error('Failed to fetch catalog/extractable data:', error);
  } finally {
    const catalogRecords = Array.isArray(parsed) ? parsed : [];
    const extractablesPayload = extractables as { records?: ExtractableRecord[] } | undefined;
    const extractablesList = extractablesPayload?.records;
    const extractablesRecords: ExtractableRecord[] = Array.isArray(extractablesList) ? extractablesList : [];
    const enriched = enrichRecords(catalogRecords, extractablesRecords);
    setLoading(false);
    return {
      data: createCatalogTree(enriched),
      sumAll: catalogRecords.length,
      sumExtractable: catalogRecords.length > 0 ? extractablesRecords.length : catalogRecords.length,
      sumNotExtractable: catalogRecords.length > 0 ? catalogRecords.length - extractablesRecords.length : catalogRecords.length
    };
  }
};

const enrichRecords = (
  records: Record<string, unknown>[],
  extractables: ExtractableRecord[]
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
