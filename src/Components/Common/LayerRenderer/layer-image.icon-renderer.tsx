import React, { useEffect, useState } from 'react';
import { IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

// interface ILayerImageCellRendererParams {
//   onClick: (data: ILayerImage, isShown: boolean) => void;
//   data: ILayerImage;
// }

export const LayerRenderer: React.FC<any> = (props) => {
  const [modelShown, setModelShown] = useState<boolean>(false);

  useEffect(() => {
    setModelShown(props.data.layerImageShown as boolean);
  }, [props.data.layerImageShown]);

  // useEffect(() => {
  //   if ('productStatus' in props.data && layerImageShown && isBeingDeleted(props.data)) {
  //     props.onClick(props.data, false);
  //   }
  // }, [(props.data as unknown as Record<string, unknown>)?.productStatus]);

  return (
    <Box>
      <IconButton
        // className={modelShown ? 'mc-icon-Show imageChecked' : 'mc-icon-Hide iconNotAllowed'}
        className={props.className}
        style={{
          width: "20px",
          height: "20px",
          background: 'red',
          margin: '2px',
        }}
        label="LAYER IMAGE SHOWN ICON"
        onClick={
          (evt: React.MouseEvent<HTMLButtonElement>): void => {
            const val = !modelShown;
            evt.stopPropagation();
            setModelShown(val);
            props.onClick(props.data, val);
          }
        }
      />
    </Box>
  );
};
