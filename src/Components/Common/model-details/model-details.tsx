import { Box } from '@map-colonies/react-components';
import { AutoDirectionBox } from '../utils/AutoDirectionBox';
import './model-details.css';

interface ModelDetailsProps {
  metadata: Record<string, unknown> | undefined,
  showOnBrief?: Record<string, unknown>
}

export const ModelDetails: React.FC<ModelDetailsProps> = (props) => {

  const MetadataRow = ({ label, value }: { label: string; value: unknown }) => {
    const isObject =
      typeof value === "object" &&
      value !== null;
    // !Array.isArray(value);

    const isArray = Array.isArray(value);

    return (
      <>
        <Box
          className="metadataRow"
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr", // שני עמודות
            // gap: "8px",
            padding: "8px 12px",
            // borderBottom: "1px solid #eee",
          }}
        >
          <AutoDirectionBox className="metadataLabel">{label}</AutoDirectionBox>

          {!isObject ? (
            // <AutoDirectionBox className="metadataValue">
            <span>
              {String(value)}
            </span>
            // </AutoDirectionBox>
          ) : (
            isObject && !isArray ?
              // <span style={{ color: "#888" }}>Object</span>
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
      </>
    );
  };

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
}
