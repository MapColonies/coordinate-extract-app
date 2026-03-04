import { CatalogTreeNode } from '../components/Wizard/Wizard.types';

const ERROR_COLOR = 'var(--mdc-theme-gc-error)';

export const getNodeTextStyle = (
  data: CatalogTreeNode,
  colorProperty: 'color' | 'backgroundColor'
): Record<string, unknown> | undefined => {
  if (data['mc:footprint'] === undefined) {
    return { [colorProperty]: ERROR_COLOR };
  }
  return undefined;
};

export const isCatalogRecordValid = (record: CatalogTreeNode) => {
  if (record['mc:footprint'] === undefined) {
    return false;
  }
  return true;
};
