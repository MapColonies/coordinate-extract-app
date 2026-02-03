import { useEffect } from 'react';
import { WizardStepProps } from '../../Wizard/Wizard.types';

export const ModelHistory: React.FC<WizardStepProps> = ({ selectedItem, setIsNextBtnDisabled }) => {
  useEffect(() => {
    setIsNextBtnDisabled(false);
  }, []);

  return <></>;
};
