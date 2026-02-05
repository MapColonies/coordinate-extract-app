import { useEffect } from 'react';
import { WizardStepProps } from '../Wizard.types';

import './MetadataHistory.css';

export const MetadataHistory: React.FC<WizardStepProps> = ({ setIsNextBtnDisabled, selectedItem }) => {
  useEffect(() => {
    setIsNextBtnDisabled(false);
  }, []);

  return <></>;
};
