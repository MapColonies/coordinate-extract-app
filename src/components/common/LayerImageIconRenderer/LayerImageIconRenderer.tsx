import React, { useEffect, useState } from 'react';
import { IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

import './LayerImageIconRenderer.css';

interface ILayerImageCellRendererParams {
  data: Record<string, unknown>;
  onClick: (data: Record<string, unknown>, isShown: boolean) => void;
}

export const LayerImageIconRenderer: React.FC<ILayerImageCellRendererParams> = (props) => {
  return (
    <Box id='LayerImageIconRenderer'>
      <IconButton
        className={props.data.isShown ? 'icon mc-icon-Show' : 'icon mc-icon-Hide'}
        label="LAYER IMAGE SHOWN ICON"
        onClick={
          (evt: React.MouseEvent<HTMLButtonElement>): void => {
            const val = !props.data.isShown;
            evt.stopPropagation();
            props.onClick(props.data, val);
          }
        }
      />
    </Box>
  );
};
