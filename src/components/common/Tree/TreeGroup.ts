import { get } from 'lodash';
import { TreeItem } from 'react-sortable-tree';
import { CatalogTreeNode } from '../../Wizard/Wizard.types';

export interface KeyPredicate {
  name: string;
  predicate: (val: any) => string;
}

export interface Group {
  key: any;
  items: any[];
  sum?: any;
}

export interface GroupBy {
  keys: KeyPredicate[];
  sum?: string[];
  thenby?: GroupBy;
}

const TOP_LEVEL_GROUP_BY_FIELD = 'mc:region';
const TITLE_PROPERTY = 'mc:productName';

export const createCatalogTree = (layersList: Record<string, unknown>[], expanded: boolean = false): CatalogTreeNode => {
  const parentCatalog = buildParentTreeNode(
    layersList,
    'DUMMY PARENT',
    // Casue working with CSW raw data (not entity)
    { keys: [{ name: 'mc:region', predicate: (val) => val/*val?.join(',')*/ }] },
    expanded
  );

  return parentCatalog;
};

const alphabeticalSort = (sortByField = TITLE_PROPERTY) => (a: Record<string, unknown>, b: Record<string, unknown>): number => {
  const aValue = get(a, `${sortByField}`);
  const bValue = get(b, `${sortByField}`);
  return (aValue as any)?.localeCompare(bValue);
};

export const resolveProperty = (obj: any, property: string): any =>
  property.split('.').reduce((result, prop) => (result ? result[prop] : undefined), obj);

export const sumGroup = (group: Group, sum: string[]): Group => {
  if (!sum || !sum.length || !group) {
    return group;
  }
  return {
    ...group,
    sum: sum.reduce(
      (sumObj, sumProp) => ({
        ...sumObj,
        [sumProp]: group.items.reduce((a, b) => resolveProperty(a, sumProp) + resolveProperty(b, sumProp))
      }),
      {}
    )
  };
};

export const groupBy = (array: any[], grouping: GroupBy): Group[] => {
  if (!array) {
    return array;
  }
  const keys = grouping.keys;
  const groups: Group[] = array.reduce((results: Group[], item) => {
    const group = results.find(g => keys.every(({ name, predicate }) => predicate(item[name]) === predicate(g.key[name])));
    const data = Object.getOwnPropertyNames(item).reduce((o: Record< string, unknown>, prop) => {
      o[prop] = item[prop];
      return o;
    }, {});
    if (group) {
      group.items.push(data);
    } else {
      results.push({
        key: keys.reduce((o: Record<string, unknown>, key) => {
          o[key.name] = item[key.name];
          return o;
        }, {}),
        items: [data]
      });
    }
    return results;
  }, []);
  return grouping.thenby
    ? groups.map(g => ({ ...g, items: groupBy(g.items, grouping.thenby as GroupBy) }))
    : groups.reduce((arr, g) => {
      //@ts-ignore
      arr.push(sumGroup(g, grouping.sum));
      return arr;
    }, []);
};

const getLayerTitle = (product: Record<string, unknown>): string => {
  return product[TITLE_PROPERTY] as string;
};

const buildParentTreeNode = (
  arr: Record<string, unknown>[],
  title: string,
  groupByParams: GroupBy,
  expanded: boolean
): {
  title: string;
  isGroup: boolean;
  expanded: boolean;
  children: TreeItem[];
} => {
  const regionPredicate = (groupByParams.keys.find(
    (k) => k.name === TOP_LEVEL_GROUP_BY_FIELD
  ) as KeyPredicate).predicate;
  const treeData = groupBy(arr, groupByParams);
  return {
    title: title,
    isGroup: true,
    expanded,
    children: treeData
      .sort((a, b) =>
        regionPredicate(a.key[TOP_LEVEL_GROUP_BY_FIELD]).localeCompare(
          regionPredicate(b.key[TOP_LEVEL_GROUP_BY_FIELD])
        )
      )
      .map((item) => {
        return {
          title: regionPredicate(item.key[TOP_LEVEL_GROUP_BY_FIELD]),
          isGroup: true,
          expanded,
          children: [
            ...item.items
              .sort(alphabeticalSort())
              .map((rec) => {
                return {
                  ...rec,
                  title: getLayerTitle(rec),
                  isSelected: false,
                };
              }),
          ],
        };
      }) as TreeItem[],
  };
};
