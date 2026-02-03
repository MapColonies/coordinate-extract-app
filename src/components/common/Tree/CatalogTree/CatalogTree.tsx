import { useEffect } from 'react';
import SortableTree, { ReactSortableTreeProps } from 'react-sortable-tree';
import { useI18n } from '../../../../i18n/I18nProvider';
import { CatalogTreeNode } from '../../../Wizard/Wizard.types';
import { LayerImageIconRenderer } from '../../LayerImageIconRenderer/LayerImageIconRenderer';
import CatalogTheme from '../renderers/index';
import { useTree } from './tree.hook';

interface CatalogTreeProps extends ReactSortableTreeProps {
  treeData: CatalogTreeNode[];
  onSelectedNode: (selectedNode: CatalogTreeNode | null, updatedTreeData: CatalogTreeNode[]) => void;
}

export const CatalogTree: React.FC<Omit<CatalogTreeProps, 'onChange'>> = (props) => {
  const {
    treeData,
    setTreeData,
    selectedNode,
    hoveredNode,
    setHoveredNode,
    handleRowClick
  } = useTree({ treeData: props.treeData });
  const { locale } = useI18n();

  useEffect(() => {
    props.onSelectedNode(selectedNode, treeData);
  }, [selectedNode]);

  useEffect(() => {
    setTreeData(props.treeData);
  }, [props.treeData]);

  return (
    <SortableTree
      //@ts-ignore
      theme={CatalogTheme}
      rowDirection={locale === 'he' ? 'rtl' : 'ltr'}
      treeData={treeData}
      canDrag={false}
      onChange={(treeData) =>
        setTreeData(treeData as CatalogTreeNode[])
      }
      generateNodeProps={(rowInfo) => {
        const node = rowInfo.node as CatalogTreeNode;
        const isSelected = node.title === selectedNode?.title;

        return {
          onClick: (e: MouseEvent) => {
            handleRowClick(e, rowInfo)
          },
          onMouseOver: (evt: MouseEvent) => {
            if (!rowInfo.node.isGroup) {
              if (rowInfo.node.id !== hoveredNode?.id) {
                setHoveredNode({
                  ...rowInfo.node,
                  parentPath: rowInfo.path.slice(0, -1).toString(),
                });
              }
            } else {
              setHoveredNode(undefined);
            }
          },
          className: isSelected ? 'selected-row' : '',
          icons: node.isGroup ?
            [] :
            [
              <LayerImageIconRenderer
                data={(rowInfo.node as any)}
                onClick={() => {
                  console.log('clicked');
                }}
              />,
              <LayerImageIconRenderer
                data={(rowInfo.node as any)}
                onClick={() => {
                  console.log('clicked');
                }}
              />,
            ],
        };
      }}
    />
  )
};
