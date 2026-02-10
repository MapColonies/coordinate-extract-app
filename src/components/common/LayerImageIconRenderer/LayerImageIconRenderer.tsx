import React from 'react';
import { IconButton } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

import './LayerImageIconRenderer.css';

interface ILayerImageIconRendererParams {
  data: Record<string, unknown>;
  onClick: (evt: MouseEvent, isShown: boolean) => void;
}

export const LayerImageIconRenderer: React.FC<ILayerImageIconRendererParams> = (props) => {

  return (
    <Box id='LayerImageIconRenderer'>
      <IconButton
        className={props.data.isShown ? 'icon mc-icon-Show' : 'icon mc-icon-Hide'}
        label="LAYER IMAGE SHOWN ICON"
        onClick={
          (evt): void => {
            evt.stopPropagation();

            props.onClick(evt as unknown as MouseEvent, !props.data.isShown);
          }
        }
      />
    </Box>
  );
};
