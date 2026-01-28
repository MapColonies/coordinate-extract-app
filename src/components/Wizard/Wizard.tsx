import { useState } from 'react';
import FormWizard from "react-form-wizard-component";
import { Box } from '@map-colonies/react-components';
import { CatalogTreeNode } from './Wizard.types';
import { CatalogTreeStep } from './ModelSelection/ModelSelectionStep';
import { BaseStep } from '../common/BaseStep/BaseStep';

import "react-form-wizard-component/dist/style.css";
import './Wizard.css';

export const Wizard: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<CatalogTreeNode | null>(null);

  return (
    <Box id='wizardWrapper' className={!selectedItem ? 'wizard-disabled-next' : ''}>
      <FormWizard stepSize='xs' showProggressBar={true} inlineStep={false} color='#1976d2' >
        {/* <FormWizard.TabContent title='Login'>
          <Login />
        </FormWizard.TabContent> */}
        <FormWizard.TabContent title='Select Model'>
          <CatalogTreeStep selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
        </FormWizard.TabContent>
        <FormWizard.TabContent title='Edit Metadata' isValid={selectedItem != null}>
          <BaseStep title='title.tree' titleMap='title.map' data={selectedItem} >
            {/* <ModelHistory></ModelHistory> */}
          </BaseStep>
        </FormWizard.TabContent>
        <FormWizard.TabContent title='Confirm'>
          <BaseStep data={selectedItem} >
            <div></div>
          </BaseStep>
        </FormWizard.TabContent>
        <FormWizard.TabContent title='Confirm'>
          <BaseStep data={selectedItem} >
            <div></div>
          </BaseStep>
        </FormWizard.TabContent>
      </FormWizard >
    </Box>
  )
};
