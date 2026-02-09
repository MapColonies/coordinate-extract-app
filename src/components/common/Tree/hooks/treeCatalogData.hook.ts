import { useCallback, useEffect, useMemo } from 'react';
import {
  changeNodeAtPath,
  ExtendedNodeData,
  find,
  getNodeAtPath,
  GetNodeKeyFunction,
  NodeData,
  TreeItem,
  TreePath
} from 'react-sortable-tree';
import { fetchCatalog } from '../../../../common/services/CatalogService';
import { CatalogTreeNode, IDENTIFIER_FIELD } from '../../../Wizard/Wizard.types';
import { get } from 'lodash';

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

interface IGetParentNode {
  parentNode: NodeData | undefined;
  path: (string | number)[];
}

interface UseTreeCatalogDataProps {
  setCatalogTreeData: (data: CatalogTreeNode[]) => void;
  catalogTreeData: CatalogTreeNode[] | undefined;
  selectedNode?: CatalogTreeNode;
  setSelectedNode?: (node: CatalogTreeNode) => void;
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

      newTreeData = changeNodeAtPath({
        treeData: newTreeData,
        path: rowInfo.path,
        newNode: {
          ...rowInfo.node,
          isSelected,
          isShown
        },
        getNodeKey: keyFromTreeIndex
      });

      props.setCatalogTreeData(newTreeData as CatalogTreeNode[]);
      props.setSelectedNode?.(rowInfo.node as CatalogTreeNode);
    }
  }, [props.catalogTreeData]);

  function changeNodeByPath(
    data: TreePath & {
      treeData?: TreeItem[],
      newNode: any,
      ignoreCollapsed?: boolean,
    }): TreeItem[] {
    return changeNodeAtPath({ ...data, getNodeKey: keyFromTreeIndex, treeData: data.treeData ?? props.catalogTreeData as TreeItem[] });
  };

  const alphabeticalSort = (sortByField = IDENTIFIER_FIELD) => (a: TreeItem, b: TreeItem): number => {
    const aValue = get(a, `${sortByField}`);
    const bValue = get(b, `${sortByField}`);
    return aValue?.localeCompare(bValue);
  };

  function getParentNode(node: NodeData, treeData: TreeItem[]): IGetParentNode {
    const FIRST_IDX = 0;
    const WITHOUT_LAST_IDX = -1;
    // In order to get the direct parent we need its path without the last one (which represent the node itself)
    const parentIndex = node.path.slice(FIRST_IDX, WITHOUT_LAST_IDX);

    const parentNode = getNodeAtPath({
      treeData,
      path: parentIndex,
      getNodeKey: keyFromTreeIndex,
    }) as NodeData;

    return ({ parentNode, path: parentIndex });
  }

  function sortGroupChildrenByFieldValue(
    parentNode: TreeItem,
    sortByField = IDENTIFIER_FIELD
  ): TreeItem | null {
    const parent = { ...parentNode };
    (parent.children as CatalogTreeNode[]).sort(alphabeticalSort(sortByField));
    return parent;
  }

  function updateNodeByProductName(productName: string, updatedNodeData: TreeItem): void {
    if (props.catalogTreeData && (props.catalogTreeData).length > 0) {
      let newTreeData: TreeItem[] = [...props.catalogTreeData as TreeItem[]];

      find({
        treeData: props.catalogTreeData as TreeItem[],
        getNodeKey: keyFromTreeIndex,
        searchMethod: (data) => data.node[IDENTIFIER_FIELD] === productName,
      }).matches.forEach((item) => {
        newTreeData = changeNodeByPath({
          treeData: newTreeData,
          newNode: {
            ...item.node,
            ...updatedNodeData
          },
          path: item.path,
        });

        const { parentNode, path: parentPath } = getParentNode(item, newTreeData);

        // Re-sort parent group children after the changes (like if title has changed)
        const sortedParentNode = sortGroupChildrenByFieldValue(parentNode?.node as TreeItem);

        newTreeData = changeNodeByPath({
          newNode: sortedParentNode,
          path: parentPath,
          treeData: newTreeData,
        });
      });

      props.setCatalogTreeData(newTreeData);
    }
  }

  return {
    treeData,
    handleRowClick,
    updateNodeByProductName
  };
};
