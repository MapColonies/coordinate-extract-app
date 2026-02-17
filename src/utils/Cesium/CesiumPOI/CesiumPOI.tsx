import { TextField, IconButton } from "@map-colonies/react-core";
import { LocationMarker } from "../LocationMarker";
import { useEffect, useState } from "react";
import { Box, CesiumCartographic, useCesiumMap } from "@map-colonies/react-components";

import "./CesiumPOI.css";

const LONGITUDE_INDEX = 0;
const LATITUDE_INDEX = 2;

export const CesiumPOI: React.FC = () => {
  const mapViewer = useCesiumMap();

  const [longitude, setLongitude] = useState<number>();
  const [latitude, setLatitude] = useState<number>();
  const [height, setHeight] = useState<number>();
  const [inputValue, setInputValue] = useState<string>("");

  const regex =
    /^(-?(?:[0-8]?\d(?:\.\d+)?|90(?:\.0+)?)),\s*(-?(?:1[0-7]\d(?:\.\d+)?|[0-9]?\d(?:\.\d+)?|180(?:\.0+)?))/;

  const isValid =
    typeof longitude === "number" &&
    typeof latitude === "number";

  useEffect(() => {
    if (!isValid || !mapViewer) {
      setHeight(undefined);
      return;
    }

    const scene = mapViewer.scene;

    const updateHeight = () => {
      const cartographic = CesiumCartographic.fromDegrees(longitude, latitude);
      const sampledHeight = scene.sampleHeight(cartographic);

      setHeight(sampledHeight);
    };
    scene.postRender.addEventListener(updateHeight);

    return () => {
      scene.postRender.removeEventListener(updateHeight);
    };
  }, [isValid, longitude, latitude, mapViewer]);

  return (
    <Box id="CesiumPOI">
      <Box className="google-search-wrapper">
        <IconButton className="mc-icon-Search" />

        <TextField
          className="cesium-geocoder-input"
          placeholder="lat, lon"
          value={inputValue}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
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
          }}
        />
      </Box>

      {isValid && height !== undefined && (
        <Box className="height-badge">
          גובה: {
            <bdi>
              {height.toFixed(2)}
            </bdi>
          } m
        </Box>
      )}

      {isValid && (
        <LocationMarker
          longitude={longitude}
          latitude={latitude}
          height={height}
        />
      )}
    </Box>
  );
};
