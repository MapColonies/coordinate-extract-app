import SortableTree, { ReactSortableTreeProps } from "react-sortable-tree";
import { LayerRenderer } from "../../LayerRenderer/layer-image.icon-renderer";
import { CatalogTreeNode } from "../../../Wizard/Wizard.types";
import CatalogTheme from '../../Tree/renderers/index';
import { useTree } from "./tree.hook";
import { useEffect } from "react";


interface CatalogTreeProps extends ReactSortableTreeProps {
  treeData: CatalogTreeNode[];
  onSelectedNode: (selectedNode: CatalogTreeNode | null) => void;
};

export const CatalogTree: React.FC<Omit<CatalogTreeProps, 'onChange'>> = (props) => {
  const {
    treeData,
    setTreeData,
    selectedNode,
    hoveredNode,
    setHoveredNode,
    handleRowClick
  } = useTree({ treeData: props.treeData });

  useEffect(() => {
    props.onSelectedNode(selectedNode);
  }, [selectedNode])

  return (
    <SortableTree
      //@ts-ignore
      theme={CatalogTheme}
      rowDirection="rtl"
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
              <LayerRenderer
                data={(rowInfo.node as any)}
                onClick={() => {
                  console.log('clicked')
                }}
              />,
              <LayerRenderer
                data={(rowInfo.node as any)}
                onClick={() => {
                  console.log('clicked')
                }}
              />,
            ],
        };
      }}
    />
  )
}