import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { WizardStepProps } from '../Wizard.types';

import './MetadataConfirm.css';

export const MetadataConfirm: React.FC<WizardStepProps> = ({ setIsNextBtnDisabled, selectedItem }) => {
  const intl = useIntl();

  const [formData, setFormData] = useState({
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Metadata committed successfully!');
  };

  return (
    <Box className="metadataConfirm">
      <Box className="formContainer">
        <form onSubmit={handleSubmit} className="form">
          <Box className="formGroup">
            <label htmlFor="password">
              <FormattedMessage id="form.password.label" />
            </label>
            <input
              type="text"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="formControl"
              placeholder={intl.formatMessage({ id: 'form.password.placeholder' })}
            />
          </Box>
        </form>
      </Box>
    </Box>
  );
};
