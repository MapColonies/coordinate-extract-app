import { TextField } from "@map-colonies/react-core"
import { LocationMarker } from "../LocationMarker"
import { useEffect, useState } from "react"
import { Box } from "@map-colonies/react-components";

import './CesiumPOI.css';

// interface CesiumGeojsonFootprintProps {

// }

const LONGITUDE_INDEX = 0;
const LATITUDE_INDEX = 2;

export const CesiumPOI: React.FC = () => {
  const [longitude, setLongitude] = useState<number>();
  const [latitude, setLatitude] = useState<number>();
  const [inputValue, setInputValue] = useState<string>("");

  const regex = /^(-?(?:[0-8]?\d(?:\.\d+)?|90(?:\.0+)?)),\s*(-?(?:1[0-7]\d(?:\.\d+)?|[0-9]?\d(?:\.\d+)?|180(?:\.0+)?))/;

  const isValid =
    typeof longitude === "number" &&
    typeof latitude === "number";

  return (
    <Box id="CesiumPOI">
      <TextField
        className="cesium-geocoder-input"
        label="lat, lon"
        value={inputValue}
        onChange={
          (e: React.FormEvent<HTMLInputElement>): void => {
            const val = e.currentTarget.value;
            setInputValue(val);
            const matches = val.match(regex);

            if (matches) {
              const lat = parseFloat(matches[LATITUDE_INDEX]);
              const lon = parseFloat(matches[LONGITUDE_INDEX]);

              setLatitude(lat);
              setLongitude(lon);
            } else {
              setLatitude(undefined);
              setLongitude(undefined);
            }
          }
        }
      />
      {/* for height in the future */}
      <TextField
        className="cesium-geocoder-input small"
        label="height"
        disabled
      />
      {
        isValid &&
        <LocationMarker longitude={longitude} latitude={latitude} />
      }
    </Box>
  )
}
