import React from 'react';
import { Box } from '@map-colonies/react-components';
import { IconButton } from '@map-colonies/react-core';
import { isCatalogRecordValid } from '../../../common/services/CatalogService';

import './LayerImageIconRenderer.css';

interface ILayerImageIconRendererParams {
  data: Record<string, unknown>;
  onClick: (evt: MouseEvent, isShown: boolean) => void;
}

export const LayerImageIconRenderer: React.FC<ILayerImageIconRendererParams> = (props) => {
  return (
    <Box id="LayerImageIconRenderer">
      <IconButton
        className={
          props.data.isShown
            ? 'icon mc-icon-Show'
            : `icon mc-icon-Hide ${!isCatalogRecordValid(props.data) && 'iconNotAllowed'}`
        }
        label="LAYER IMAGE SHOWN ICON"
        onClick={(evt): void => {
          if (isCatalogRecordValid(props.data)) {
            evt.stopPropagation();
            props.onClick(evt as unknown as MouseEvent, !props.data.isShown);
          }
        }}
      />
    </Box>
  );
};
