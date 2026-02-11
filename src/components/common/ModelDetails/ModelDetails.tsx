import React from 'react';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import { Box } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';
import { AutoDirectionBox } from '../../../common/AutoDirectionBox/AutoDirectionBox';
import { ApprovedSVGIcon } from '../../../common/icons/ApprovedSVGIcon';
import { useI18n } from '../../../i18n/I18nProvider';
import { formatDate } from '../../../utils/formatter';

import './ModelDetails.css';

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
    ['mc:productName']: productName,
    ['ows:BoundingBox']: boundingBox,
    ...metadata
  } = item || {};
  const typedExtractable = extractable as Extractable | undefined;

  const { locale } = useI18n();

  const normalizeLabel = (label: string): string => {
    return label.includes(':') ? label.split(':')[1] : label;
  };

  const TruncatedValue: React.FC<{ value: unknown }> = ({ value }) => {
    const stringValue = String(value);
    return (
      <Typography
        tag="span"
        title={stringValue}
        className="metadataValue"
      >
        {stringValue}
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
          padding: "8px 12px",
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
        <Box className="detailsTitle">{String(productName)}</Box>
      }
      <Box className="metadata">
        {
          metadata &&
          Object.entries(metadata).map(([key, value]) => (
            <MetadataItem key={key} label={key} value={value} />
          ))
        }
      </Box>
      {
        metadata &&
        !!typedExtractable &&
        <Box className="extractable">
          <ApprovedSVGIcon color="var(--mdc-theme-gc-success)" />
          <FormattedMessage
            id="details.extractable.approved"
            values={{
              name: typedExtractable.authorizedBy,
              value: formatDate(typedExtractable.authorizedAt, locale)
            }}
          />
        </Box>
      }
      {
        isEmpty(metadata) &&
        <Box className="noData">
          <FormattedMessage id="details.noData" />
        </Box>
      }
    </Box>
  );
};
