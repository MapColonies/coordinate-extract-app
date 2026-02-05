import { SVGProps, useState } from 'react';
import FormWizard from 'react-form-wizard-component';
import { useIntl } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import Header from '../../common/Header/Header';
import { MetadataHistory } from './MetadataHistory/MetadataHistory';
import { Step } from '../common/Step/Step';
import { MetadataConfirm } from './MetadataConfirm/MetadataConfirm';
import { MetadataForm } from './MetadataForm/MetadataForm';
import { ModelSelection } from './ModelSelection/ModelSelection';
import { CatalogTreeNode } from './Wizard.types';

import 'react-form-wizard-component/dist/style.css';
import './Wizard.css';

const selectionSvg = (props?: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-search w-4 h-4"
      {...props}
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.3-4.3"></path>
    </svg>
  );
};

const detailsSvg = (props?: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-search w-4 h-4"
      {...props}
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
      <path d="M10 9H8"></path>
      <path d="M16 13H8"></path>
      <path d="M16 17H8"></path>
    </svg>
  );
};

const updateSvg = (props?: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-search w-4 h-4"
      {...props}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
};

const confirmSvg = (props?: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-search w-4 h-4"
      {...props}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
    </svg>
  );
};

export const Wizard: React.FC = () => {
  const [catalogTree, setCatalogTree] = useState<CatalogTreeNode[] | undefined>(undefined);
  const [selectedItem, setSelectedItem] = useState<CatalogTreeNode | undefined>(undefined);
  const [disabled, setDisabled] = useState<boolean>(true);
  const intl = useIntl();

  const handleComplete = () => {
    setCatalogTree(undefined);
    setSelectedItem(undefined);
    setDisabled(true);
  };

  return (
    <Box className={`wizardWrapper ${disabled ? 'wizardDisabledNext' : ''}`}>
      <FormWizard
        stepSize='xs'
        color='var(--mdc-theme-gc-primary)'
        title={<Header />}
        backButtonText={intl.formatMessage({ id: 'button.back' })}
        nextButtonText={intl.formatMessage({ id: 'button.next' })}
        finishButtonText={intl.formatMessage({ id: 'button.finish' })}
        onComplete={handleComplete}
      >
        <FormWizard.TabContent title={intl.formatMessage({ id: 'step.selection' })} icon={selectionSvg()}>
          <ModelSelection
            catalogTreeData={catalogTree}
            setCatalogTreeData={(treeData) => { setCatalogTree(treeData); }}
            selectedItem={selectedItem}
            setSelectedItem={(treeNode) => { setSelectedItem(treeNode); }}
            setIsNextBtnDisabled={(val) => { setDisabled(val); }}
          />
        </FormWizard.TabContent>
        <FormWizard.TabContent title={intl.formatMessage({ id: 'step.details' })} icon={detailsSvg()}>
          <Step selectedItem={selectedItem} title="title.history">
            <MetadataHistory setIsNextBtnDisabled={(val) => { setDisabled(val) }} selectedItem={selectedItem} />
          </Step>
        </FormWizard.TabContent>
        <FormWizard.TabContent title={intl.formatMessage({ id: 'step.update' })} icon={updateSvg()}>
          <Step selectedItem={selectedItem} title="title.updater">
            <MetadataForm setIsNextBtnDisabled={(val) => { setDisabled(val) }} selectedItem={selectedItem} />
          </Step>
        </FormWizard.TabContent>
        <FormWizard.TabContent title={intl.formatMessage({ id: 'step.confirm' })} icon={confirmSvg()}>
          <Step selectedItem={selectedItem} title="title.confirm">
            <MetadataConfirm setIsNextBtnDisabled={(val) => { setDisabled(val) }} selectedItem={selectedItem} />
          </Step>
        </FormWizard.TabContent>
      </FormWizard >
    </Box>
  );
};
