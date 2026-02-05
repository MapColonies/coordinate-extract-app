import { ExtractableRecords } from '../../components/common/CatalogMockData';
import { createCatalogTree } from '../../components/common/Tree/TreeGroup';
import { IDENTIFIER_FIELD } from '../../components/Wizard/Wizard.types';
import appConfig from '../../utils/Config';
import { getRecordsXML, parseQueryResults } from '../../utils/cswQueryBuilder';
import { requestExecutor } from '../../utils/requestHandler';

export const fetchCatalog = async () => {
  const data = getRecordsXML();

  const res = await requestExecutor({
    url: `${appConfig.csw3dUrl}`,
    injectToken: true
  }, 'POST', {
    data,
  });
  const parsed = parseQueryResults(res.data, 'mc:MC3DRecord') as Record<string, unknown>[];

  const getExtractableRecords = ExtractableRecords;
  const enriched = enrichRecords(parsed, getExtractableRecords);

  return {
    data: createCatalogTree(enriched),
    sumAll: parsed.length,
    sumExt: getExtractableRecords.length,
    sumNExt: parsed.length - getExtractableRecords.length
  };
};

const enrichRecords = (
  records: Record<string, unknown>[],
  extraFields: Record<string, unknown>[]
): Record<string, unknown>[] => {
  return records.map((record) => {
    const isMatched = extraFields.some(
      (ext) => record[IDENTIFIER_FIELD] === ext.recordName
    );

    return {
      ...record,
      isApproved: isMatched,
      isShown: false
    };
  });
};
