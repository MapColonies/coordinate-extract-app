import SortableTree, { ExtendedNodeData, ReactSortableTreeProps } from 'react-sortable-tree';
import { ApprovedSVGIcon } from '../../../../common/Icons/Svg/approved';
import { NotApprovedSVGIcon } from '../../../../common/Icons/Svg/notApproved';
import { useI18n } from '../../../../i18n/I18nProvider';
import { CatalogTreeNode } from '../../../Wizard/Wizard.types';
import { LayerImageIconRenderer } from '../../LayerImageIconRenderer/LayerImageIconRenderer';
import CatalogTheme from '../renderers/index';

interface CatalogTreeProps extends ReactSortableTreeProps {
  treeData: CatalogTreeNode[];
  setTreeData: (treeData: CatalogTreeNode[]) => void;
  selectedNode: CatalogTreeNode;
  handleRowClick: (evt: MouseEvent, rowInfo: ExtendedNodeData, isSelected: boolean, isShown?: boolean) => void;
}

export const CatalogTree: React.FC<Omit<CatalogTreeProps, 'onChange'>> = (props) => {
  const { locale } = useI18n();

  return (
    <SortableTree
      //@ts-ignore
      theme={CatalogTheme}
      rowDirection={locale === 'he' ? 'rtl' : 'ltr'}
      treeData={props.treeData}
      canDrag={false}
      onChange={(treeData) =>
        props.setTreeData(treeData as CatalogTreeNode[])
      }
      generateNodeProps={(rowInfo) => {
        const node = rowInfo.node as CatalogTreeNode;
        const isSelected = node.title === props.selectedNode?.title;

        return {
          onClick: (e: MouseEvent) => {
            props.handleRowClick(e, rowInfo, !rowInfo.node.isSelected);
          },
          className: isSelected ? 'selected-row' : '',
          icons: node.isGroup ?
            [] :
            [
              <LayerImageIconRenderer
                data={(rowInfo.node)}
                onClick={(evt: MouseEvent, isShown) => {
                  let isSelected = false;
                  if (isShown) {
                    isSelected = true;
                  } else if (rowInfo.node.isSelected) {
                    isSelected = rowInfo.node.isSelected;
                  }

                  props.handleRowClick(evt, rowInfo, isSelected, isShown);
                }}
              />,
            ],
          buttons: [
            rowInfo.node?.isApproved ?
              <ApprovedSVGIcon color='var(--mdc-theme-gc-success)' />
              :
              <NotApprovedSVGIcon color='var(--mdc-theme-gc-warning)' />
          ]
        };
      }}
    />
  )
};
