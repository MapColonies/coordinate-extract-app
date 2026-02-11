import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import { Box } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';
import { AutoDirectionBox } from '../../../common/AutoDirectionBox/AutoDirectionBox';
import { ApprovedSVGIcon } from '../../../common/icons/ApprovedSVGIcon';
import { NotApprovedSVGIcon } from '../../../common/icons/NotApprovedSVGIcon';
import { useI18n } from '../../../i18n/I18nProvider';
import { formatDate } from '../../../utils/formatter';

import './ModelDetails.css';

const PRIORITY_FIELDS = [
  'mc:id',
  'mc:productStatus',
  'mc:imagingTimeBeginUTC',
  'mc:imagingTimeEndUTC',
  'mc:insertDate',
  'mc:productVersion',
  'mc:maxHorizontalAccuracyCE90',
  'mc:accuracyLE90',
  'mc:typeName',
  'mc:classification',
  'mc:productSource',
  'mc:description',
];

interface Extractable {
  authorizedBy: string;
  authorizedAt: string;
}

interface ModelDetailsProps {
  item: Record<string, unknown> | undefined
}

export const ModelDetails: React.FC<ModelDetailsProps> = ({ item }) => {
  const {
    extractable,
    isApproved,
    isSelected,
    isShown,
    title,
    // eslint-disable-next-line no-useless-computed-key
    ['mc:productName']: productName,
    // eslint-disable-next-line no-useless-computed-key
    ['ows:BoundingBox']: boundingBox,
    ...metadata
  } = item || {};
  const typedExtractable = extractable as Extractable | undefined;

  const { locale } = useI18n();

  const orderedMetadataEntries = useMemo(() => {
    if (!metadata) {
      return [];
    }
    const entries = Object.entries(metadata);
    return entries.sort((a, b) => {
      const aIndex = PRIORITY_FIELDS.indexOf(a[0]);
      const bIndex = PRIORITY_FIELDS.indexOf(b[0]);
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, [metadata]);

  const normalizeLabel = (label: string): string => {
    return label.includes(':') ? label.split(':')[1] : label;
  };

  const isValidDateString = (value: unknown): value is string => {
    if (typeof value !== 'string') {
      return false;
    }
    if (value.length < 8) {
      return false;
    }
    const date = new Date(value);
    return !isNaN(date.getTime());
  };

  const TruncatedValue: React.FC<{ value: unknown }> = ({ value }) => {
    let displayValue: string;
    if (isValidDateString(value)) {
      displayValue = formatDate(value, locale).replace(/\./g, '/');
    } else {
      displayValue = String(value);
    }
    return (
      <Typography
        tag="span"
        title={displayValue}
        className="metadataValue"
        dir="auto"
      >
        {displayValue}
      </Typography>
    );
  };

  const MetadataItem = ({ label, value }: { label: string; value: unknown }) => {
    const isObject = typeof value === "object" && value !== null;
    const isArray = Array.isArray(value);
    return (
      <Box
        className="metadataItem"
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          padding: "10px 6px",
        }}
      >
        <AutoDirectionBox className="metadataLabel">
          <FormattedMessage id={`details.field.${normalizeLabel(label)}`} defaultMessage={label} />
        </AutoDirectionBox>
        {
          !isObject ? (
              <TruncatedValue value={value} />
            ) : (
              isObject && !isArray ?
                Object.entries(value as Record<string, unknown>).map(
                  ([childKey, childValue]) => (
                    <MetadataItem
                      key={childKey}
                      label={childKey}
                      value={childValue}
                    />
                  )
                ) : (
                  <>
                    {value.join(', ')}
                  </>
                )
            )
        }
      </Box>
    );
  };

  return (
    <Box className="detailsContainer">
      {
        !!productName &&
        <Box className="detailsHeader">
          <Box className="title">
            {String(productName)}
          </Box>
          <Box className="extractable">
            {
              !isApproved ?
                <>
                  <NotApprovedSVGIcon color="var(--mdc-theme-gc-warning)" />
                  <FormattedMessage id="details.extractable.notApproved" />
                </> :
                !!typedExtractable ?
                  <>
                    <ApprovedSVGIcon color="var(--mdc-theme-gc-success)" />
                    <FormattedMessage
                      id="details.extractable.approved"
                      values={{
                        name: typedExtractable.authorizedBy,
                        value: formatDate(typedExtractable.authorizedAt, locale, true)
                      }}
                    />
                  </> :
                  <></>
            }
          </Box>
        </Box>
      }
      <Box className="metadata">
        {
          metadata &&
          orderedMetadataEntries.map(([key, value]) => (
            <MetadataItem key={key} label={key} value={value} />
          ))
        }
      </Box>
      {
        isEmpty(metadata) &&
        <Box className="noData">
          <FormattedMessage id="details.noData" />
        </Box>
      }
    </Box>
  );
};
