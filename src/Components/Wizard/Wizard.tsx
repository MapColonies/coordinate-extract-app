import { useState } from 'react';
import { Box } from '@map-colonies/react-components';
import { CatalogTreeNode } from './Wizard.types';
import { CatalogTreeStep } from './ModelSelection/ModelSelectionStep';
import { MetadataFormStep } from './MetadataForm/MetadataFormStep';

import './Wizard.css';

export const Wizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedItem, setSelectedItem] = useState<CatalogTreeNode | null>(null);

  const handleNext = (data?: CatalogTreeNode) => {
    if (data) {
      setSelectedItem(data);
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const steps = [
    {
      title: 'Select Model',
      component: <CatalogTreeStep onNext={handleNext} />
    },
    {
      title: 'Edit Metadata',
      component: <MetadataFormStep onPrevious={handlePrevious} data={selectedItem ?? undefined} />
    }
  ];

  return (
    <Box className="wizard-container">
      <Box className="wizard-header">
        <Box className="wizard-steps">
          {steps.map((step, index) => (
            <Box
              key={index}
              className={`wizard-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            >
              <Box className="step-number">{index + 1}</Box>
              <Box className="step-title">{step.title}</Box>
            </Box>
          ))}
        </Box>
      </Box>
      <Box className="wizard-content">
        {steps[currentStep]?.component}
      </Box>
    </Box>
  );
};
