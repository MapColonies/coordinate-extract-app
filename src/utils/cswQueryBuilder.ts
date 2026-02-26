import { XMLParser } from 'fast-xml-parser';
import appConfig from './Config';

const extractSearchResults = (xml: string) => {
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml);

  return parsed?.['csw:GetRecordsResponse']?.['csw:SearchResults'];
};

export const get3DRecordsXML = (
  resultType: string = 'results',
  maxRecords: number = appConfig.numberOfRecordsPerPage,
  startPosition: number = 1
) => {
  return `
    <csw:GetRecords
      xmlns="http://www.opengis.net/cat/csw/2.0.2"
      xmlns:csw="http://www.opengis.net/cat/csw/2.0.2"
      xmlns:ogc="http://www.opengis.net/ogc"
      xmlns:gml="http://www.opengis.net/gml"
      xmlns:ows="http://www.opengis.net/ows"
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:dct="http://purl.org/dc/terms/"
      service="CSW"
      version="2.0.2"
      resultType="${resultType}"
      maxRecords="${maxRecords}"
      startPosition="${startPosition}"
      outputSchema="http://schema.mapcolonies.com/3d">
        <csw:Query typeNames="csw:Record">
          <csw:ElementSetName>full</csw:ElementSetName>
        </csw:Query>
    </csw:GetRecords>`;
};

export const parse3DQueryResults = (xml: string): Record<string, unknown>[] | null => {
  let retValue = null;
  const searchResults = extractSearchResults(xml);
  if (searchResults?.['@_numberOfRecordsMatched'] === '0') {
    console.error(`Didn't find matched IDs!`);
    return retValue;
  }
  const records = searchResults['mc:MC3DRecord'];
  if (Array.isArray(records)) {
    retValue = records;
  } else {
    retValue = [records];
  }

  return retValue.filter((record) =>
    ['3DPhotoRealistic', 'PointCloud'].includes(record['mc:productType'])
  );
};

export const getNumberOfMatchedRecords = (xml: string): number => {
  const searchResults = extractSearchResults(xml);
  return Number(searchResults?.['@_numberOfRecordsMatched'] ?? 0);
}
