import { createCatalogTree } from '../../components/common/Tree/TreeGroup';
import { CatalogTreeNode, IDENTIFIER_FIELD } from '../../components/Wizard/Wizard.types';
import appConfig from '../../utils/Config';
import {
  get3DRecordsXML,
  getNumberOfMatchedRecords,
  parse3DQueryResults,
} from '../../utils/cswQueryBuilder';
import { loadingUpdater } from '../../utils/loadingUpdater';
import { execute } from '../../utils/requestHandler';
import { ExtractableRecord, ExtractableResponse } from './ExtractableService';

const PAGE_SIZE = appConfig.numberOfRecordsPerPage;
const EXTRACTABLE_PAGE_SIZE = appConfig.numberOfExtractablesPerPage;
const EMPTY = 0;
const NOT_EXIST_TREE_NAME = '!!NOT_EXIST!!'

export const isCatalogRecordValid = (record: CatalogTreeNode) => {
  if (record['mc:footprint'] === undefined) {
    return false;
  }

  return true;
}

const fetchAll3DRecordsParallel = async () => {
  const numberOfRecordsXml = get3DRecordsXML('hits', 0);

  const resNumberOfRecords = await execute(`${appConfig.csw3dUrl}`, 'POST', {
    data: numberOfRecordsXml,
  });

  const totalRecords = getNumberOfMatchedRecords(resNumberOfRecords as string);
  const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

  const promises = Array.from({ length: totalPages }, (_, i) => {
    const startPosition = i * PAGE_SIZE + 1;
    const xml = get3DRecordsXML('results', PAGE_SIZE, startPosition);
    return execute(appConfig.csw3dUrl, 'POST', { data: xml });
  });

  const responses = await Promise.all(promises);

  const allRecords = responses.flatMap(
    (res) => parse3DQueryResults(res as string) as Record<string, unknown>[]
  );

  return allRecords;
};

const fetchExtractables = async () => {
  let extract: ExtractableRecord[] = [];
  let startIndex = 1;

  while (startIndex > 0) {
    const extractableResponse: ExtractableResponse = (await execute(
      `${appConfig.extractableManagerUrl}/records?startPosition=${startIndex}&maxRecords=${EXTRACTABLE_PAGE_SIZE}`,
      'GET'
    )) as unknown as ExtractableResponse;
    if (Array.isArray(extractableResponse.records)) {
      extract.push(...extractableResponse.records);
      startIndex = extractableResponse.nextRecord as number;
    }
  }
  return extract;
};

export const fetchCatalog = async (setLoading: loadingUpdater) => {
  let catalogRecords = [];
  let extractables: ExtractableRecord[] = [];
  let enriched: Record<string, unknown>[] = [];
  let mismatchedExtractables: ExtractableRecord[] | null = null;

  try {
    setLoading(true);
    catalogRecords = await fetchAll3DRecordsParallel();
    extractables = await fetchExtractables();
    const res = enrichRecords(catalogRecords, extractables);
    enriched = res.enrichedRecords;
    mismatchedExtractables = res.mismatchedExtractables;
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }

  const allRecordsLength = catalogRecords.length + (mismatchedExtractables?.length || 0);

  return {
    data: createCatalogTree(enriched),
    sumAll: allRecordsLength,
    sumExtractable: extractables.length,
    sumNotExtractable:
      catalogRecords.length > EMPTY
        ? allRecordsLength - extractables.length
        : EMPTY,
    mismatchedExtractables
  };
};

const enrichRecords = (
  records: Record<string, unknown>[],
  extractables: ExtractableRecord[]
): {
  enrichedRecords: Record<string, unknown>[];
  mismatchedExtractables: ExtractableRecord[];
} => {
  const extractableById = new Map(extractables.map((e) => [e.recordName, e]));
  const enrichedRecords = records.map((record) => {
    const id = record[IDENTIFIER_FIELD] as string;
    const matched = extractableById.get(id);

    if (matched) {
      extractableById.delete(id);
    }

    return {
      ...record,
      isApproved: Boolean(matched),
      isShown: false,
      extractable: matched,
    };
  });

  if (extractableById.size > EMPTY) {
    extractableById.forEach((e) => {

      enrichedRecords.push({
        //@ts-ignore
        [IDENTIFIER_FIELD]: e.recordName,
        isApproved: true,
        "mc:region": NOT_EXIST_TREE_NAME
      });
    });
  }

  return {
    enrichedRecords,
    mismatchedExtractables: Array.from(extractableById.values()),
  };
};
