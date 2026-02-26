import { createCatalogTree } from '../../components/common/Tree/TreeGroup';
import { IDENTIFIER_FIELD } from '../../components/Wizard/Wizard.types';
import appConfig from '../../utils/Config';
import { get3DRecordsXML, getNumberOfMatchedRecords, parse3DQueryResults } from '../../utils/cswQueryBuilder';
import { loadingUpdater } from '../../utils/loadingUpdater';
import { execute } from '../../utils/requestHandler';
import { ExtractableRecord, ExtractableResponse } from './ExtractableService';

const PAGE_SIZE = appConfig.numberOfRecordsPerPage;
const EXTRACTABLE_PAGE_SIZE = appConfig.numberOfExtractablesPerPage;

const fetchAll3DRecordsParallel = async () => {
  const numberOfRecordsXml = get3DRecordsXML('hits', 0);

  const resNumberOfRecords = await execute(
    `${appConfig.csw3dUrl}`,
    'POST',
    { data: numberOfRecordsXml }
  );

  const totalRecords = getNumberOfMatchedRecords(resNumberOfRecords as string);
  const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

  const promises = Array.from({ length: totalPages }, (_, i) => {
    const startPosition = i * PAGE_SIZE + 1;

    const xml = get3DRecordsXML(
      'results',
      PAGE_SIZE,
      startPosition,
    );

    return execute(
      appConfig.csw3dUrl,
      'POST',
      { data: xml }
    );
  });

  const responses = await Promise.all(promises);

  const allRecords = responses.flatMap((res) =>
    parse3DQueryResults(res as string) as Record<string, unknown>[]
  );

  return allRecords;
};

const fetchExtractable = async () => {
  let extract: ExtractableRecord[] = [];
  let startIndex = 1;

  while (startIndex > 0) {
    const extractableResponse: ExtractableResponse = await execute(
      `${appConfig.extractableManagerUrl}/records?startPosition=${startIndex}&maxRecords=${EXTRACTABLE_PAGE_SIZE}`,
      'GET'
    ) as unknown as ExtractableResponse;
    if (Array.isArray(extractableResponse.records)) {
      extract.push(...extractableResponse.records);
      startIndex = extractableResponse.nextRecord as number;
    }
  }
  return extract;
}

export const fetchCatalog = async (setLoading: loadingUpdater) => {
  let records;
  let extractables: ExtractableRecord[] = [];

  try {
    setLoading(true);
    records = await fetchAll3DRecordsParallel();
    extractables = await fetchExtractable();
  } catch (error) {
    console.error('Failed to fetch catalog/extractable data:', error);
  } finally {
    const catalogRecords = Array.isArray(records) ? records : [];
    const enriched = enrichRecords(catalogRecords, extractables);
    setLoading(false);
    return {
      data: createCatalogTree(enriched),
      sumAll: catalogRecords.length,
      sumExtractable:
        catalogRecords.length > 0 ? extractables.length : catalogRecords.length,
      sumNotExtractable:
        catalogRecords.length > 0
          ? catalogRecords.length - extractables.length
          : catalogRecords.length,
    };
  }
};

const enrichRecords = (
  records: Record<string, unknown>[],
  extractables: ExtractableRecord[]
): Record<string, unknown>[] => {
  const extractableById = new Map(extractables.map((e) => [e.recordName as string, e]));
  return records.map((record) => {
    const id = record[IDENTIFIER_FIELD] as string;
    const matched = extractableById.get(id);
    return {
      ...record,
      isApproved: Boolean(matched),
      isShown: false,
      extractable: matched,
    };
  });
};
