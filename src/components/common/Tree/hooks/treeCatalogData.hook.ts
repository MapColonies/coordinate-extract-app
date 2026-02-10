import { useCallback, useEffect, useMemo } from 'react';
import {
  changeNodeAtPath,
  ExtendedNodeData,
  find,
  getNodeAtPath,
  GetNodeKeyFunction,
  TreeItem
} from 'react-sortable-tree';
import { fetchCatalog } from '../../../../common/services/CatalogService';
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

interface UseTreeCatalogDataProps {
  setCatalogTreeData: (data: CatalogTreeNode[]) => void;
  catalogTreeData: CatalogTreeNode[] | undefined;
  setSelectedNode: (node: CatalogTreeNode) => void;
  handleRowClick?: (evt: MouseEvent, rowInfo: ExtendedNodeData, additionalFields: Record<string, unknown>) => void;
  filter?: FilterOpt;
  setSummaryCount?: (summary: ISummary) => void;
}

const keyFromTreeIndex: GetNodeKeyFunction = ({ treeIndex }) => treeIndex;

export const useTreeCatalogData = (props: UseTreeCatalogDataProps) => {
  useEffect(() => {
    // if (!catalogTreeData) {
    //   setTimeout(() => {
    //     setCatalogTreeData(mockCatalogData as unknown as CatalogTreeNode[]);
    //   }, 500);
    // }

    if (props.catalogTreeData) {
      return;
    }

    (async () => {
      try {
        const treeData = await fetchCatalog();
        props.setCatalogTreeData(treeData.data.children as CatalogTreeNode[]);
        props.setSummaryCount?.({
          all: treeData.sumAll,
          extractable: treeData.sumExt,
          notExtractable: treeData.sumNExt
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, []);

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
    if (!props.catalogTreeData) {
      return;
    }
    return filterByPredicate(props.catalogTreeData, (treeItem) => {
      return treeItem[fieldName]?.toString().includes(String(fieldValue));
    });
  };

  const treeData = useMemo(() => {
    if (!props.catalogTreeData) {
      return [];
    }
    switch (props.filter?.type) {
      case "field": return filterByField(props.filter.fieldName, props.filter.fieldValue);
      case "none": return props.catalogTreeData;
    }
  }, [props.catalogTreeData, props.filter]);

  useEffect(() => {
    console.log(props.catalogTreeData)
  }, [props.catalogTreeData])

  const handleRowClick = useCallback((evt: MouseEvent, rowInfo: ExtendedNodeData, isSelected: boolean, isShown?: boolean) => {
    if (!rowInfo.node.isGroup && props.catalogTreeData) {
      let newTreeData: TreeItem[] = [...props.catalogTreeData];
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

      props.setCatalogTreeData(newTreeData);
      props.setSelectedNode(newNode);
    }
  }, [props.catalogTreeData]);

  return {
    treeData,
    handleRowClick
  };
};
