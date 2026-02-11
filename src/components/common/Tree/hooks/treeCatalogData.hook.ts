import { useEffect, useState } from 'react';
import {
  changeNodeAtPath,
  ExtendedNodeData,
  find,
  getNodeAtPath,
  GetNodeKeyFunction,
  TreeItem
} from 'react-sortable-tree';
import { CatalogTreeNode } from '../../../Wizard/Wizard.types';

export type FilterOpt =
  | {
    type: 'field'
    fieldName: string
    fieldValue: unknown
  } | {
    type: 'none'
  };

export interface ISummary {
  all: number;
  extractable: number;
  notExtractable: number;
}

interface UseTreeCatalogDataParams {
  catalogTreeData: CatalogTreeNode[];
  setSelectedNode: (node: CatalogTreeNode | undefined) => void;
  handleRowClick?: (evt: MouseEvent, rowInfo: ExtendedNodeData, additionalFields: Record<string, unknown>) => void;
  filter?: FilterOpt;
  setSummaryCount?: (summary: ISummary) => void;
}

const keyFromTreeIndex: GetNodeKeyFunction = ({ treeIndex }) => treeIndex;

export const useTreeCatalogData = (params: UseTreeCatalogDataParams) => {
  const [filteredTreeData, setFilteredTreeData] = useState(params.catalogTreeData);

  const filterByPredicate = (catalogTreeData: CatalogTreeNode[], filterBy: (treeItem: TreeItem) => boolean) => {
    const filteredCatalog = catalogTreeData?.map((tree) => {
      const matchedChildren = (tree.children as TreeItem[])?.filter((child) => {
        return filterBy(child);
      });

      if (!matchedChildren || matchedChildren.length === 0) {
        return null;
      }

      return {
        ...tree,
        children: matchedChildren,
      };
    }).filter(Boolean);

    return filteredCatalog;
  };

  const filterByField = (fieldName: string, fieldValue: unknown) => {
    return filterByPredicate(params.catalogTreeData, (treeItem) => {
      return treeItem[fieldName]?.toString().includes(String(fieldValue));
    });
  };

  useEffect(() => {
    switch (params.filter?.type) {
      case "field": {
        const filteredData = filterByField(params.filter.fieldName, params.filter.fieldValue);
        setFilteredTreeData(filteredData as CatalogTreeNode[]);
        params.setSelectedNode(undefined);
        break;
      }
      case "none": {
        setFilteredTreeData([...params.catalogTreeData]);
        params.setSelectedNode(undefined);
        break;
      }
    }
  }, [params.filter]);

  const handleRowClick = (evt: MouseEvent, rowInfo: ExtendedNodeData, isSelected: boolean, isShown?: boolean) => {
    if (!rowInfo.node.isGroup && params.catalogTreeData) {
      let newTreeData: TreeItem[] = [...filteredTreeData as CatalogTreeNode[]];
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
              isSelected: false,
              isShown: false
            },
            getNodeKey: keyFromTreeIndex
          });
        });
      }

      const newNode = {
        ...rowInfo.node,
        isSelected,
        isShown
      };

      newTreeData = changeNodeAtPath({
        treeData: newTreeData,
        path: rowInfo.path,
        newNode,
        getNodeKey: keyFromTreeIndex
      });

      setFilteredTreeData(newTreeData);
      params.setSelectedNode(newNode);
    }
  };

  return {
    treeData: filteredTreeData,
    setTreeData: setFilteredTreeData,
    handleRowClick
  };
};
