import { useEffect } from "react";
import { WizardStepProps } from "../../Wizard/Wizard.types";


export const ModelHistory: React.FC<WizardStepProps> = ({ setIsNextBtnDisabled }) => {
  useEffect(() => {
    setIsNextBtnDisabled(true);

    setTimeout(() => {
      setIsNextBtnDisabled(false);
    }, 5000)
  }, [])


  return <></>;
}