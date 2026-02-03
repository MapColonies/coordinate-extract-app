import { createCatalogTree } from '../../components/common/Tree/TreeGroup';
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

  return createCatalogTree(parsed);
};
