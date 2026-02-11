import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import SortableTree, { ReactSortableTreeProps } from 'react-sortable-tree';
import { Box } from '@map-colonies/react-components';
import { Button, TextField } from '@map-colonies/react-core';
import { ApprovedSVGIcon } from '../../../../common/icons/approved';
import { NotApprovedSVGIcon } from '../../../../common/icons/notApproved';
import { useDebounce } from '../../../../hooks/useDebounce';
import { useI18n } from '../../../../i18n/I18nProvider';
import { CatalogTreeNode, IDENTIFIER_FIELD, MAIN_FIELD } from '../../../Wizard/Wizard.types';
import { LayerImageIconRenderer } from '../../LayerImageIconRenderer/LayerImageIconRenderer';
import CatalogTheme from '../renderers/index';
import { FilterOpt, ISummary, useTreeCatalogData } from '../hooks/treeCatalogData.hook';

import './CatalogTree.css';

interface CatalogTreeProps extends ReactSortableTreeProps {
  treeData: CatalogTreeNode[];
  setTreeData: (treeData: CatalogTreeNode[]) => void;
  selectedNode?: CatalogTreeNode;
  setSelectedNode: (item?: CatalogTreeNode) => void;
  itemsSummary: ISummary;
  setItemsSummary: (summary: ISummary) => void;
}

const FILTER_BY_DATA_FIELD = IDENTIFIER_FIELD;
const QUICK_FILTER_BY_DATA_FIELD = MAIN_FIELD;

export const CatalogTree: React.FC<Omit<CatalogTreeProps, 'onChange'>> = (props) => {
  const { locale } = useI18n();
  const intl = useIntl();
  const [filterOptions, setFilterBy] = useState<FilterOpt>({ type: 'field', fieldName: FILTER_BY_DATA_FIELD, fieldValue: '' });

  const debouncedSearch = useDebounce((value: string) => {
    setFilterBy({ type: 'field', fieldName: FILTER_BY_DATA_FIELD, fieldValue: value });
  }, 300);

  const {
    treeData,
    handleRowClick,
    setTreeData
  } = useTreeCatalogData({
    catalogTreeData: props.treeData,
    setSelectedNode: (node) => props.setSelectedNode?.(node),
    filter: filterOptions,
    setSummaryCount: (sum) => props.setItemsSummary?.(sum)
  });

  return (
    <Box id='catalogTree'>
      <Box className="filter">
        <TextField
          type="text"
          className="textField"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            debouncedSearch(value);
          }}
          placeholder={intl.formatMessage({ id: 'tree.filter.placeholder' })}
        />
        <Box className="filterBtnsContainer">
          <Button className="filterBtn"
            onClick={() => setFilterBy({ type: 'none' })}>
            <FormattedMessage id="tree.filter.all" values={{ sum: props.itemsSummary?.all }} />
          </Button>
          <Button className="filterBtn"
            onClick={() => setFilterBy({
              type: 'field',
              fieldName: QUICK_FILTER_BY_DATA_FIELD,
              fieldValue: true
            })}
            style={{ color: 'var(--mdc-theme-gc-success)' }}
          >
            <FormattedMessage id="tree.filter.approved" values={{ sum: props.itemsSummary?.extractable }} />
          </Button>
          <Button className="filterBtn"
            onClick={() => setFilterBy({
              type: 'field',
              fieldName: QUICK_FILTER_BY_DATA_FIELD,
              fieldValue: false
            })}
            style={{ color: 'var(--mdc-theme-gc-warning)' }}
          >
            <FormattedMessage id="tree.filter.not-approved" values={{ sum: props.itemsSummary?.notExtractable }} />
          </Button>
        </Box>
      </Box>
      <SortableTree
        //@ts-ignore
        theme={CatalogTheme}
        className='sortableTree'
        rowDirection={locale === 'he' ? 'rtl' : 'ltr'}
        treeData={treeData as CatalogTreeNode[]}
        canDrag={false}
        onChange={(treeData) =>
          setTreeData(treeData as CatalogTreeNode[])
        }
        generateNodeProps={(rowInfo) => {
          const node = rowInfo.node as CatalogTreeNode;
          const isSelected = node.title === props.selectedNode?.title;

          return {
            onClick: (e: MouseEvent) => {
              handleRowClick(e, rowInfo, !rowInfo.node.isSelected);
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

                    handleRowClick(evt, rowInfo, isSelected, isShown);
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
    </Box>
  )
};
