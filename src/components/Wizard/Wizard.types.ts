import { Geometry } from 'geojson';
import { TreeItem } from 'react-sortable-tree';

export interface Footprint {
  type: string;
  coordinates: number[][][];
}

export interface Metadata {
  footprint: Geometry;
  [key: string]: any;
}

export interface CatalogTreeNode extends TreeItem {
  id: string;
  title: string;
  isGroup?: boolean;
  metadata?: Metadata;
}

export interface WizardStepProps {
  setIsNextBtnDisabled: (val: boolean) => void;
  selectedItem?: CatalogTreeNode;
}

export interface WizardSelectionProps extends WizardStepProps {
  setCatalogTreeData: (data: CatalogTreeNode[]) => void;
  catalogTreeData?: CatalogTreeNode[];
  setSelectedItem?: (item: CatalogTreeNode | undefined) => void;
}
