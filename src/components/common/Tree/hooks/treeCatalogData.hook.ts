import { TreeItem } from "react-sortable-tree";
import { CatalogTreeNode } from "../../../Wizard/Wizard.types";
import { useEffect, useMemo, useState } from "react";
import { fetchCatalog } from "../../../../common/services/CatalogService";

interface UseTreeCatalogDataProps {
  setCatalogTreeData: (data: CatalogTreeNode[]) => void;
  catalogTreeData?: CatalogTreeNode[];
  filterSearchText?: string;
}

export const useTreeCatalogData = (props: UseTreeCatalogDataProps) => {
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (props.filterSearchText !== undefined) {
      setSearchText(props.filterSearchText);
    }
  }, [props.filterSearchText]);

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
        props.setCatalogTreeData(treeData.children as CatalogTreeNode[]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, []);

  const filterCatalogData = (catalogTreeData: CatalogTreeNode[], value: string) => {
    if (value === '') {
      return catalogTreeData;
    }

    const filteredCatalog = catalogTreeData?.map((tree) => {
      const matchedChildren = (tree.children as TreeItem[])?.filter((child) => {
        return (child.title as string).includes(value);
      });

      if (!matchedChildren || matchedChildren.length === 0) {
        return null;
      }

      return {
        ...tree,
        children: matchedChildren,
      };
    })
      .filter(Boolean);

    return filteredCatalog;
  };

  const treeData = useMemo(() => {
    if (!props.catalogTreeData) {
      return [];
    }
    if (searchText === undefined || searchText === '') {
      return props.catalogTreeData;
    }
    const filtered = filterCatalogData(props.catalogTreeData, searchText);
    return filtered ?? [];
  }, [props.catalogTreeData, searchText]);

  return {
    treeData
  }
}