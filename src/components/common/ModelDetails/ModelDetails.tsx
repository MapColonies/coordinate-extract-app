import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import { Box } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';
import { AutoDirectionBox } from '../../../common/AutoDirectionBox/AutoDirectionBox';

import './ModelDetails.css';

interface ModelDetailsProps {
  metadata: Record<string, unknown> | undefined,
  showOnBrief?: Record<string, unknown>
}

export const ModelDetails: React.FC<ModelDetailsProps> = (props) => {

  const MetadataRow = ({ label, value }: { label: string; value: unknown }) => {
    const isObject =
      typeof value === "object" &&
      value !== null;

    const isArray = Array.isArray(value);

    return (
      <Box
        className="metadataRow"
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          padding: "8px 12px",
        }}
      >
        <AutoDirectionBox className="metadataLabel">{label}</AutoDirectionBox>
        {
          !isObject ? (
              <Typography tag="span">
                {String(value)}
              </Typography>
            ) : (
              isObject && !isArray ?
                Object.entries(value as Record<string, unknown>).map(
                  ([childKey, childValue]) => (
                    <MetadataRow
                      key={childKey}
                      label={childKey}
                      value={childValue}
                    />
                  )
                ) :
                <>
                  {value.join(', ')}
                </>
            )
        }
      </Box>
    );
  };

  if (isEmpty(props.metadata)) {
    return <Box className="detailsPlaceholder"><FormattedMessage id="details.placeholder" /></Box>;
  }

  return (
    <Box className="detailsContainer">
      {
        props.metadata &&
        Object.entries(props.metadata).map(([key, value]) => (
          <MetadataRow key={key} label={key} value={value} />
        ))
      }
    </Box>
  );
};
