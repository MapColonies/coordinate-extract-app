import { useCallback, useState } from "react";
import { CatalogTreeNode } from "../../../Wizard/Wizard.types";
import { changeNodeAtPath, ExtendedNodeData, find, getNodeAtPath, TreeItem } from "react-sortable-tree";

interface TreeProps {
  treeData: CatalogTreeNode[];
}

//@ts-ignore
const keyFromTreeIndex = ({ treeIndex }) => treeIndex;
const actionDismissibleRegex = new RegExp('actionDismissible');


export const useTree = (props: TreeProps) => {
  const [treeData, setTreeData] = useState<CatalogTreeNode[]>(props.treeData);
  const [selectedNode, setSelectedNode] = useState<CatalogTreeNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<TreeItem>();

  const handleRowClick = useCallback((evt: MouseEvent, rowInfo: ExtendedNodeData) => {
    if (!rowInfo.node.isGroup) {
      let newTreeData: TreeItem[] = treeData;
      if (!evt.ctrlKey) {
        // Remove prev selection
        const selection = find({
          treeData: newTreeData,
          getNodeKey: keyFromTreeIndex,
          searchMethod: (data) => data.node.isSelected,
        });

        selection.matches.forEach(match => {
          const selRowInfo = getNodeAtPath({
            treeData: newTreeData,
            path: match.path,
            getNodeKey: keyFromTreeIndex,
            // ignoreCollapsed: false,
          });

          newTreeData = changeNodeAtPath({
            treeData: newTreeData,
            path: match.path,
            newNode: {
              ...selRowInfo?.node,
              isSelected: false
            },
            getNodeKey: keyFromTreeIndex
          });
        });
      }

      newTreeData = changeNodeAtPath({
        treeData: newTreeData,
        path: rowInfo.path,
        newNode: {
          ...rowInfo.node,
          isSelected: !rowInfo.node.metadata?.isSelected
        },
        getNodeKey: keyFromTreeIndex
      });

      if (evt.target !== null && actionDismissibleRegex.test((evt.target as any).className)) {
        setHoveredNode(undefined);
      }

      setTreeData(newTreeData as CatalogTreeNode[]);
      setSelectedNode(rowInfo.node as CatalogTreeNode);
    }
  }, [treeData]);

  return {
    treeData,
    setTreeData,
    selectedNode,
    hoveredNode,
    setHoveredNode,
    handleRowClick
  };
}