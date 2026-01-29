import { useState } from 'react';
import FormWizard from "react-form-wizard-component";
import { Box } from '@map-colonies/react-components';
import { CatalogTreeNode } from './Wizard.types';
import { ModelSelectionStep } from './ModelSelection/ModelSelectionStep';
import { BaseStep } from '../common/BaseStep/BaseStep';
import { ModelHistory } from '../common/ModelHistory/ModelHistory';
import { MetadataFormStep } from './MetadataForm/MetadataFormStep';

import "react-form-wizard-component/dist/style.css";
import './Wizard.css';

export const Wizard: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<CatalogTreeNode | undefined>(undefined);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [catalogTree, setCatalogTree] = useState<CatalogTreeNode[] | undefined>(undefined);


  return (
    <Box id='wizardWrapper' className={disabled ? 'wizardDisabledNext' : ''}>
      <FormWizard stepSize='xs' color='#1976d2' >
        {/* <FormWizard.TabContent title='Login'>
          <Login />
        </FormWizard.TabContent> */}
        <FormWizard.TabContent title='Select Model'>
          <ModelSelectionStep
            catalogTreeData={catalogTree}
            setCatalogTreeData={(treeData) => setCatalogTree(treeData)}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            setIsNextBtnDisabled={(val) => { setDisabled(val) }}
          />
        </FormWizard.TabContent>
        <FormWizard.TabContent title='Edit Metadata'>
          <BaseStep title='title.tree' titleMap='title.map' metadata={selectedItem?.metadata} >
            <ModelHistory selectedItem={selectedItem} setIsNextBtnDisabled={(val) => { setDisabled(val) }} />
          </BaseStep>
        </FormWizard.TabContent>
        <FormWizard.TabContent title='Confirm'>
          <BaseStep metadata={selectedItem?.metadata} >
            <MetadataFormStep selectedItem={selectedItem} setIsNextBtnDisabled={(val) => { setDisabled(val) }} />
          </BaseStep>
        </FormWizard.TabContent>
        <FormWizard.TabContent title='Confirm'>
          <BaseStep metadata={selectedItem?.metadata} >
            <div></div>
          </BaseStep>
        </FormWizard.TabContent>
      </FormWizard >
    </Box>
  )
};
