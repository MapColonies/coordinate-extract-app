import { XMLParser } from 'fast-xml-parser';

export const getRecordsXML = () => {
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
      resultType="results"
      outputSchema="http://schema.mapcolonies.com/3d">
        <csw:Query typeNames="csw:Record">
            <csw:ElementSetName>full</csw:ElementSetName>
        </csw:Query>
    </csw:GetRecords>`;
};

export const parseQueryResults = (xml: string, recordType: string): Record<string, unknown>[] | null => {
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsedQuery = parser.parse(xml);
  const recordsResult = parsedQuery['csw:GetRecordsResponse']['csw:SearchResults'];
  if (recordsResult['@_numberOfRecordsMatched'] === '0') {
    console.error(`Didn't find matched IDs!`);
    return null;
  }
  const records = parsedQuery['csw:GetRecordsResponse']['csw:SearchResults'][recordType];
  if (Array.isArray(records)) {
    return records;
  }
  return [records];
};
