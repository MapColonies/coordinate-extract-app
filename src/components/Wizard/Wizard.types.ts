import { TreeItem } from 'react-sortable-tree';

export interface CatalogTreeNode extends TreeItem {
  isGroup?: boolean;
  "mc:footprint"?: string;
  "mc:links"?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface WizardStepProps {
  setIsNextBtnDisabled: (val: boolean) => void;
  selectedItem?: CatalogTreeNode;
}

export interface WizardSelectionProps extends WizardStepProps {
  setCatalogTreeData: (data: CatalogTreeNode[]) => void;
  catalogTreeData?: CatalogTreeNode[];
  setSelectedItem?: (item?: CatalogTreeNode) => void;
}

export const IDENTIFIER_FIELD = 'mc:productName';
export const MAIN_FIELD = 'isApproved';
