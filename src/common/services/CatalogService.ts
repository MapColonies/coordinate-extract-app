import { mockExtractableRecords } from '../../components/common/MockData';
import { createCatalogTree } from '../../components/common/Tree/TreeGroup';
import { IDENTIFIER_FIELD } from '../../components/Wizard/Wizard.types';
import appConfig from '../../utils/Config';
import { get3DRecordsXML, parse3DQueryResults } from '../../utils/cswQueryBuilder';
import { execute } from '../../utils/requestHandler';
import { loadingUpdater } from '../../utils/loadingUpdater';

export const fetchCatalog = async (setLoading?: loadingUpdater, submitErrorToSnackbarQueue = true) => {
  const data = get3DRecordsXML();
  const records = await execute(
    `${appConfig.csw3dUrl}`,
    'POST',
    { data },
    setLoading,
    submitErrorToSnackbarQueue
  );
  const parsed = parse3DQueryResults(records as string) as Record<string, unknown>[];

  let extractableRecordsData, extractableRecords;
  try {
    extractableRecordsData = await execute(
      `${appConfig.extractableManagerUrl}/records}`,
      'GET',
      undefined,
      setLoading,
      submitErrorToSnackbarQueue
    );
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
