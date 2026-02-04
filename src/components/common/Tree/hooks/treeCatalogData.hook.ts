import { TreeItem } from "react-sortable-tree";
import { CatalogTreeNode } from "../../../Wizard/Wizard.types";
import { useEffect, useMemo } from "react";
import { fetchCatalog } from "../../../../common/services/CatalogService";

export type FilterOpt =
  | {
    type: 'text'
    text: string
  }
  | {
    type: 'field'
    fieldName: string
    fieldValue: string
  } | {
    type: 'none'
  }

export interface Summery {
  all: number,
  extractable: number,
  notExtractable: number
}

interface UseTreeCatalogDataProps {
  setCatalogTreeData: (data: CatalogTreeNode[]) => void;
  catalogTreeData?: CatalogTreeNode[];
  filter?: FilterOpt;
  setSummeryCount?: (summery: Summery) => void;
}

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
        props.setSummeryCount?.({
          all: treeData.sumAll,
          extractable: treeData.sumExt,
          notExtractable: treeData.sumNExt
        })
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
  }

  const filterCatalogByTitle = (value: string) => {
    if (value === '' || !props.catalogTreeData) {
      return props.catalogTreeData;
    }

    return filterByPredicate(props.catalogTreeData, (treeItem) => {
      return !!(treeItem.title)?.toString().includes(value);
    });
  };

  const filterByField = (fieldName: string, fieldValue: string) => {
    if (!props.catalogTreeData) {
      return;
    }
    return filterByPredicate(props.catalogTreeData, (treeItem) => {
      return treeItem[fieldName]?.toString().includes(fieldValue);
    });
  }

  const treeData = useMemo(() => {
    if (!props.catalogTreeData) {
      return [];
    }
    switch (props.filter?.type) {
      case 'text': return filterCatalogByTitle(props.filter.text);
      case "field": return filterByField(props.filter.fieldName, props.filter.fieldValue);
      case "none": return props.catalogTreeData;
    }
  }, [props.catalogTreeData, props.filter]);

  return {
    treeData
  }
}