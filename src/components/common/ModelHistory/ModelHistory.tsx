import { useEffect } from 'react';
import { WizardStepProps } from '../../Wizard/Wizard.types';

export const ModelHistory: React.FC<WizardStepProps> = ({ setIsNextBtnDisabled, selectedItem }) => {
  useEffect(() => {
    setIsNextBtnDisabled(false);
  }, []);

  return <></>;
};
