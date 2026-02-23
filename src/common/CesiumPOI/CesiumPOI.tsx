import { useEffect, useMemo, useState } from 'react';
import { Box } from '@map-colonies/react-components';
import { TextField, IconButton } from '@map-colonies/react-core';
import { CoordinateSVGIcon } from '../icons/CoordinateSVGIcon';
import { lonLatToGeoJsonPoint, FlyTo } from '../../utils/Cesium/FlyTo';
import { LocationMarker } from '../../utils/Cesium/LocationMarker';
import { useCesiumHeight } from '../../utils/Cesium/useCesiumHeight.hook';

import './CesiumPOI.css';

const LONGITUDE_INDEX = 1;
const LATITUDE_INDEX = 2;
const COORD_REGEX = /^(-?(?:[0-8]?\d(?:\.\d+)?|90(?:\.0+)?))\s*,\s*(-?(?:1[0-7]\d(?:\.\d+)?|[0-9]?\d(?:\.\d+)?|180(?:\.0+)?))$/;
const MAX_HEIGHT = 8850; // Everest
const MIN_HEIGHT = -450; // Dead Sea
const NOT_AVAILABLE_TEXT = 'N/A';

interface CesiumPOIProps {
  setIsInProgress?: (val: boolean) => void;
  blinkDependencies?: Record<string, unknown>;
}

export const CesiumPOI: React.FC<CesiumPOIProps> = (props) => {
  const [finishedFlying, setFinishedFlying] = useState(false);
  const [flyToGeometry, setFlyToGeometry] = useState<boolean>(false);
  const [searchText, setSearchText] = useState('');
  const [isNeedRefreshHeight, setIsNeedRefreshHeight] = useState(false);

  const parsedCoords = useMemo(() => {
    const trimmed = searchText.trim();
    const matches = trimmed.match(COORD_REGEX);
    if (!matches) {
      return;
    }

    return {
      lon: parseFloat(matches[LONGITUDE_INDEX]),
      lat: parseFloat(matches[LATITUDE_INDEX]),
    };
  }, [searchText]);

  const { height, resetHeight } = useCesiumHeight({
    lon: parsedCoords?.lon,
    lat: parsedCoords?.lat,
    enabled: finishedFlying,
  });

  useEffect(() => {
    resetHeight();

    if (searchText === '') {
      setIsNeedRefreshHeight(false);
    }
  }, [searchText]);

  useEffect(() => {
    if (parsedCoords) {
      setIsNeedRefreshHeight(true);
    }
  }, [props.blinkDependencies]);

  const handleClick = () => {
    resetHeight();

    if (!parsedCoords) {
      return;
    }

    setFlyToGeometry(true);
    setIsNeedRefreshHeight(false);
  };

  return (
    <Box id="CesiumPOI">
      <IconButton
        className={`icon ${isNeedRefreshHeight ? 'blink' : ''}`}
        icon={
          <CoordinateSVGIcon color="var(--mdc-theme-on-surface)" />
        }
        onClick={() => {
          handleClick();
        }}
      />

      <TextField
        className="input"
        label="lon, lat"
        dir="ltr"
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
          geometry={lonLatToGeoJsonPoint(parsedCoords.lon, parsedCoords.lat, 0)}
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
