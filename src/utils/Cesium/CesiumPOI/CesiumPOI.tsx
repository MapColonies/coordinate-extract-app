import { useEffect, useMemo, useState } from "react";
import { Box, CesiumCartographic, cesiumSampleTerrainMostDetailed, useCesiumMap } from "@map-colonies/react-components";
import { TextField, IconButton } from "@map-colonies/react-core";
import { isEmpty } from "lodash";
import { PlaceCoordinateSVGIcon } from "../../../common/icons/PlaceCoordinateSVGIcon";
import { LocationMarker } from "../LocationMarker";
import { coordinate2cartesian, FlyTo } from "../FlyTo";

import "./CesiumPOI.css";

const LONGITUDE_INDEX = 0;
const LATITUDE_INDEX = 2;

interface CesiumPOIProps {
  setIsInProgress?: (val: boolean) => void;
  blinkDependencies?: Record<string, unknown>;
}

const COORD_REGEX = /^(-?(?:[0-8]?\d(?:\.\d+)?|90(?:\.0+)?)),\s*(-?(?:1[0-7]\d(?:\.\d+)?|[0-9]?\d(?:\.\d+)?|180(?:\.0+)?))/;
const MAX_HEIGHT = 8850; // Everest
const MIN_HEIGHT = -450; // Dead Sea
const NOT_AVAILABLE_TEXT = 'N/A';

export const CesiumPOI: React.FC<CesiumPOIProps> = (props) => {
  const mapViewer = useCesiumMap();
  const [height, setHeight] = useState<number>();
  const [finishedFlying, setFinishedFlying] = useState(false);
  const [flyToGeometry, setFlyToGeometry] = useState<boolean>(false);
  const [searchText, setSearchText] = useState('');

  const [isNeedRefreshHeight, setIsNeedRefreshHeight] = useState(false);

  const parsedCoords = useMemo(() => {
    const matches = searchText.match(COORD_REGEX);
    if (!matches) return;

    return {
      lon: parseFloat(matches[LONGITUDE_INDEX]),
      lat: parseFloat(matches[LATITUDE_INDEX]),
    };
  }, [searchText]);

  // const isValidLonLat = typeof longitude === "number" && typeof latitude === "number" && regex.test(searchText);
  // const isValidLonLat = parsedCoords !== undefined;

  const handleClick = () => {
    setHeight(undefined);

    if (!parsedCoords) {
      return;
    }

    setFlyToGeometry(true);
    setIsNeedRefreshHeight(false);
  };

  useEffect(() => {
    setHeight(undefined);

    if (searchText === '') {
      setIsNeedRefreshHeight(false);
    }
  }, [searchText]);

  useEffect(() => {
    if (parsedCoords) {
      setIsNeedRefreshHeight(true);
    }
  }, [props.blinkDependencies]);

  useEffect(() => {
    if (!parsedCoords || !mapViewer || !finishedFlying) {
      return;
    }

    let cancelled = false;

    const scene = mapViewer.scene;

    const updateHeight = async () => {
      const cartographic = CesiumCartographic.fromDegrees(parsedCoords.lon, parsedCoords.lat);
      let sampledHeight: number | undefined;

      // TODO: ONLY ONE model on scene
      const tileset = mapViewer.scene.primitives.get(1);

      if (tileset) {
        // Wait for tileset to finish loading/refining
        await tileset.readyPromise;

        // Extra wait until refinement stabilizes
        await new Promise(resolve => {
          scene.postRender.addEventListener(function check() {
            // TODO: Private access
            if (!tileset._statistics.numberOfPendingRequests) {
              scene.postRender.removeEventListener(check);
              resolve(0);
            }
          });
        });
        // sampleHeightMostDetailed works on RENDERED materials, here we are waiting only on the 3DTileset to be fully loaded
        const updated = await scene.sampleHeightMostDetailed([cartographic]);
        sampledHeight = updated[0].height;
      } else {
        // cesiumSampleTerrainMostDetailed makes EXTRA REQUEST if needed
        const updatedPositions = await cesiumSampleTerrainMostDetailed(
          mapViewer.terrainProvider,
          [cartographic]
        );

        if (!isEmpty(updatedPositions)) {
          sampledHeight = updatedPositions[0].height;
        } else {
          sampledHeight = undefined;
        }
      }

      if (!cancelled && sampledHeight !== undefined) {
        setHeight(sampledHeight);
      }
    };

    updateHeight();

    return () => {
      cancelled = true;
    };

  }, [finishedFlying, mapViewer]);

  return (
    <Box id="CesiumPOI">
      <IconButton
        className={`icon ${isNeedRefreshHeight ? 'blink' : ''}`}
        icon={
          <PlaceCoordinateSVGIcon color="currentColor" />
        }
        onClick={() => {
          handleClick();
        }}
      />

      <TextField
        className="input"
        label="lat, lon"
        invalid={searchText !== '' && !parsedCoords}
        onChange={(e: React.FormEvent<HTMLInputElement>): void => {
          const val = e.currentTarget.value;
          setSearchText(val);
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            handleClick();
          }
        }}
      />

      <Box className="seperator" />

      <TextField
        className={`input height withoutRipple ${isNeedRefreshHeight ? 'blink' : ''}`}
        value={height !== undefined && height <= MAX_HEIGHT && height >= MIN_HEIGHT ? height.toFixed(2) : NOT_AVAILABLE_TEXT}
        label='(m)'
        dir="ltr"
        readOnly
      />

      {parsedCoords && height !== undefined && (
        <LocationMarker
          longitude={parsedCoords.lon}
          latitude={parsedCoords.lat}
          height={height}
        />
      )}
      {
        parsedCoords && flyToGeometry &&
        <FlyTo
          geometry={coordinate2cartesian(parsedCoords.lon, parsedCoords.lat, 0)}
          onFinishedFlying={(val) => {
            props.setIsInProgress?.(!val);
            setFinishedFlying(val);
            setFlyToGeometry(false);
          }}
        />
      }
    </Box>
  );
};
