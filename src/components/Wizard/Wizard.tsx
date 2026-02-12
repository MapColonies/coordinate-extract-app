import { useRef, useState } from 'react';
import FormWizard from 'react-form-wizard-component';
import { FormWizardMethods } from 'react-form-wizard-component/dist/types/types/FormWizard';
import { useIntl } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { Button, SnackbarQueue } from '@map-colonies/react-core';
import { MetadataHistory } from './MetadataHistory/MetadataHistory';
import { Step } from '../common/Step/Step';
import { MetadataConfirm } from './MetadataConfirm/MetadataConfirm';
import { MetadataForm } from './MetadataForm/MetadataForm';
import { ModelSelection } from './ModelSelection/ModelSelection';
import { CatalogTreeNode } from './Wizard.types';
import { SnackbarManager } from '../common/SnackBar/SnackbarManager';
import { SelectionSVGIcon } from '../../common/icons/SelectionSVGIcon';
import { DetailsSVGIcon } from '../../common/icons/DetailsSVGIcon';
import { UpdateSVGIcon } from '../../common/icons/UpdateSVGIcon';
import { ConfirmSVGIcon } from '../../common/icons/ConfirmSVGIcon';
import { ISummary } from '../common/Tree/hooks/treeCatalogData.hook';

import 'react-form-wizard-component/dist/style.css';
import './Wizard.css';

export const Wizard: React.FC = () => {
  const [catalogTree, setCatalogTree] = useState<CatalogTreeNode[] | undefined>(undefined);
  const [selectedItem, setSelectedItem] = useState<CatalogTreeNode | undefined>(undefined);
  const [itemsSummary, setItemsSummary] = useState<ISummary | undefined>(undefined);
  const [disabled, setDisabled] = useState<boolean>(true);
  const intl = useIntl();
  const wizardRef = useRef<FormWizardMethods>(null);
  
  const handleComplete = () => {
    setCatalogTree(undefined);
    setSelectedItem(undefined);
    setDisabled(true);
    wizardRef.current?.goToTab(0);
  };

  return (
    <Box className={`wizardWrapper`}>
      <SnackbarQueue
        messages={SnackbarManager.messages}
        leading
        stacked
      />
      <FormWizard
        ref={wizardRef}
        stepSize='xs'
        color='var(--mdc-theme-primary)'
        backButtonTemplate={(handlePrevious) => (
          <Button raised onClick={handlePrevious} className='wizard-footer-right'>
            {intl.formatMessage({ id: 'button.back' })}
          </Button>
        )}
        nextButtonTemplate={(handleNext) => (
          <Button raised disabled={disabled} onClick={handleNext} className='wizard-footer-left'>
            {intl.formatMessage({ id: 'button.next' })}
          </Button>
        )}
        finishButtonTemplate={(handleComplete) => (
          <Button raised disabled={disabled} onClick={handleComplete} className='wizard-footer-left'>
            {intl.formatMessage({ id: 'button.finish' })}
          </Button>
        )}
        onComplete={handleComplete}
      >
        <FormWizard.TabContent title={intl.formatMessage({ id: 'step.selection' })} icon={<SelectionSVGIcon color="currentColor" />}>
          <ModelSelection
            catalogTreeData={catalogTree}
            setCatalogTreeData={setCatalogTree}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            setIsNextBtnDisabled={setDisabled}
            itemsSummary={itemsSummary as ISummary}
            setItemsSummary={setItemsSummary}
          />
        </FormWizard.TabContent>
        <FormWizard.TabContent title={intl.formatMessage({ id: 'step.details' })} icon={<DetailsSVGIcon color="currentColor"/>}>
          <Step selectedItem={selectedItem} title="panel.history.title">
            <MetadataHistory
              setIsNextBtnDisabled={(val) => { setDisabled(val) }}
              selectedItem={selectedItem}
            />
          </Step>
        </FormWizard.TabContent>
        <FormWizard.TabContent title={intl.formatMessage({ id: 'step.update' })} icon={<UpdateSVGIcon color="currentColor" />}>
          <Step selectedItem={selectedItem} title="panel.updater.title">
            <MetadataForm
              setIsNextBtnDisabled={(val) => { setDisabled(val) }}
              selectedItem={selectedItem}
              setSelectedItem={(treeNode) => { setSelectedItem(treeNode); }}
            />
          </Step>
        </FormWizard.TabContent>
        <FormWizard.TabContent title={intl.formatMessage({ id: 'step.confirm' })} icon={<ConfirmSVGIcon color="currentColor" />}>
          <Step selectedItem={selectedItem} title="panel.confirm.title">
            {
              selectedItem &&
              <MetadataConfirm
                setIsNextBtnDisabled={(val) => { setDisabled(val) }}
                selectedItem={selectedItem}
              />
            }
          </Step>
        </FormWizard.TabContent>
      </FormWizard >
    </Box>
  );
};
