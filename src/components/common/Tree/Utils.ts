import { CatalogTreeNode } from "../../Wizard/Wizard.types";

const ERROR_COLOR = 'var(--mdc-theme-error)';

export const getNodeTextStyle = (
  data: CatalogTreeNode,
  colorProperty: 'color' | 'backgroundColor'
): Record<string, unknown> | undefined => {
  if (data['mc:footprint'] === undefined) {
    return { [colorProperty]: ERROR_COLOR };
  }
  return undefined;
};
