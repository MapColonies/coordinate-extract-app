import { useCallback, useRef, useState } from 'react';
import FormWizard from "react-form-wizard-component";
import { Box } from '@map-colonies/react-components';
import { CatalogTreeNode } from './Wizard.types';
import { ModelSelectionStep } from './ModelSelection/ModelSelectionStep';
import { BaseStep } from '../common/BaseStep/BaseStep';

import "react-form-wizard-component/dist/style.css";
import './Wizard.css';
import { ModelHistory } from '../common/ModelHistory/ModelHistory';
import { MetadataFormStep } from './MetadataForm/MetadataFormStep';

export const Wizard: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<CatalogTreeNode | null>(null);
  const [disabled, setDisabled] = useState<boolean>(true);

  return (
    <Box id='wizardWrapper' className={disabled ? 'wizardDisabledNext' : ''}>
      <FormWizard stepSize='xs' color='#1976d2' >
        {/* <FormWizard.TabContent title='Login'>
          <Login />
        </FormWizard.TabContent> */}
        <FormWizard.TabContent title='Select Model'>
          <ModelSelectionStep
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            setIsNextBtnDisabled={(val) => { setDisabled(val) }}
          />
        </FormWizard.TabContent>
        <FormWizard.TabContent title='Edit Metadata'>
          <BaseStep title='title.tree' titleMap='title.map' data={selectedItem} >
            <ModelHistory selectedItem={selectedItem} setIsNextBtnDisabled={(val) => { setDisabled(val) }} />
          </BaseStep>
        </FormWizard.TabContent>
        <FormWizard.TabContent title='Confirm'>
          <BaseStep data={selectedItem} >
            <MetadataFormStep selectedItem={selectedItem} setIsNextBtnDisabled={(val) => { setDisabled(val) }} />
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
