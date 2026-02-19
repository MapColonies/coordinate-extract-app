import { useEffect, useState } from "react";
import { Box, CesiumCartographic, cesiumSampleTerrainMostDetailed, useCesiumMap } from "@map-colonies/react-components";
import { TextField, Button } from "@map-colonies/react-core";
import { Geometry } from "geojson";
import { isEmpty } from "lodash";
import { PlaceCoordinateSVGIcon } from "../../../common/icons/PlaceCoordinateSVGIcon";
import { LocationMarker } from "../LocationMarker";
import { coordinate2cartesian, FlyTo } from "../FlyTo";

import "./CesiumPOI.css";

const LONGITUDE_INDEX = 0;
const LATITUDE_INDEX = 2;

interface CesiumPOIProps {
  setIsInProgress?: (val: boolean) => void;
}

export const CesiumPOI: React.FC<CesiumPOIProps> = (props) => {
  const mapViewer = useCesiumMap();

  const [longitude, setLongitude] = useState<number>();
  const [latitude, setLatitude] = useState<number>();
  const [height, setHeight] = useState<number>();

  const [inputValue, setInputValue] = useState<string>("");
  const [finishedFlying, setFinishedFlying] = useState(false);
  const [geometry, setGeometry] = useState<Geometry>();

  const regex =
    /^(-?(?:[0-8]?\d(?:\.\d+)?|90(?:\.0+)?)),\s*(-?(?:1[0-7]\d(?:\.\d+)?|[0-9]?\d(?:\.\d+)?|180(?:\.0+)?))/;

  const isValid =
    typeof longitude === "number" &&
    typeof latitude === "number";

  useEffect(() => {
    setHeight(undefined);
    if (isValid) {
      setGeometry(coordinate2cartesian(longitude, latitude, 0));
    } else {
      setGeometry(undefined);
    }
  }, [longitude, latitude]);

  useEffect(() => {
    if (!isValid || !mapViewer || !finishedFlying) {
      return;
    }

    const scene = mapViewer.scene;

    const updateHeight = async () => {
      const cartographic = CesiumCartographic.fromDegrees(longitude, latitude);
      let height: number | undefined;

      const tileset = mapViewer.scene.primitives.get(1);

      console.log('tileset', tileset);

      if (tileset) {
        // Wait for tileset to finish loading/refining
        await tileset.readyPromise;

        // Extra wait until refinement stabilizes
        await new Promise(resolve => {
          scene.postRender.addEventListener(function check() {
            if (!tileset._statistics.numberOfPendingRequests) {
              scene.postRender.removeEventListener(check);
              resolve(0);
            }
          });
        });
        // sampleHeightMostDetailed works on RENDERED materials, here we are waiting only on the 3DTileset to be fully loaded
        const updated = await scene.sampleHeightMostDetailed([cartographic]);
        height = updated[0].height;
      } else {
        // cesiumSampleTerrainMostDetailed makes EXTRA REQUEST if needed
        const updatedPositions = await cesiumSampleTerrainMostDetailed(
          mapViewer.terrainProvider,
          [cartographic]
        );

        if (!isEmpty(updatedPositions)) {
          height = updatedPositions[0].height;
        } else {
          height = undefined;
        }
      }

      if (height !== undefined) {
        setHeight(height);
      }
    };

    updateHeight();
  }, [finishedFlying, mapViewer]);

  return (
    <Box id="CesiumPOI">
      <Box className="google-search-wrapper">
        <Button
          className="icon"
          icon={<PlaceCoordinateSVGIcon color="currentColor" />}
          onClick={() => {
            if (geometry) {
              setGeometry({ ...geometry });
            }
          }}
        />

        <TextField
          className="cesium-geocoder-input"
          placeholder="lat, lon"
          helpText="Use ENTER to pin location"
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
      <Box className="heightContainer">

        <Box className="seperator"></Box>

        {isValid && height !== undefined && (
          <Box className="height-badge">
            {
              <bdi>
                {height.toFixed(2)}
              </bdi>
            } m
          </Box>
        )}
      </Box>

      {isValid && height !== undefined && (
        <LocationMarker
          longitude={longitude}
          latitude={latitude}
          height={height}
        />
      )}
      {
        isValid && geometry &&
        <FlyTo
          geometry={geometry}
          setFinishedFlying={(val) => {
            props.setIsInProgress?.(!val);
            setFinishedFlying(val);
          }}
        />
      }
    </Box>
  );
};
