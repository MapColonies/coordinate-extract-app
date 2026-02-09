import { TreeItem } from 'react-sortable-tree';
import { ISummary } from '../common/Tree/hooks/treeCatalogData.hook';

export interface CatalogTreeNode extends TreeItem {
  isGroup?: boolean;
  "mc:footprint"?: string;
  "mc:links"?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface WizardStepProps {
  setIsNextBtnDisabled: (val: boolean) => void;
  selectedItem?: CatalogTreeNode;
  setSelectedItem?: (item?: CatalogTreeNode) => void;
}

export interface WizardSelectionProps extends WizardStepProps {
  setCatalogTreeData: (data: CatalogTreeNode[]) => void;
  catalogTreeData?: CatalogTreeNode[];
  setSelectedItem?: (item?: CatalogTreeNode) => void;
  itemsSummary?: ISummary;
  setItemsSummary?: (summary: ISummary) => void;
}

export const IDENTIFIER_FIELD = 'mc:productName';
export const MAIN_FIELD = 'isApproved';
