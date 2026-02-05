import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';
import { WizardStepProps } from '../Wizard.types';

import './MetadataForm.css';

export const MetadataForm: React.FC<WizardStepProps> = ({ setIsNextBtnDisabled, selectedItem }) => {
  const intl = useIntl();
  
  const [formData, setFormData] = useState({
    approver: '',
    additionalInfo: ''
  });

  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);

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
    alert('Metadata saved successfully!');
  };

  return (
    <Box className="metadataForm">
      <Box className="formContainer">
        <Box className={`formHeader ${selectedItem?.isApproved ? 'reject' : 'approve'}`}>
          <Typography tag="span">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
            </svg>
          </Typography>
          <FormattedMessage id={`${selectedItem?.isApproved ? 'form.message.reject' : 'form.message.approve'}`} />
        </Box>
        <form onSubmit={handleSubmit} className="form">
          <Box className="formGroup">
            <label htmlFor="approver">
              <FormattedMessage id="form.approver.label" />
            </label>
            <input
              type="text"
              id="approver"
              name="approver"
              value={formData.approver}
              onChange={handleChange}
              required
              className="formControl"
              placeholder={intl.formatMessage({ id: 'form.approver.placeholder' })}
            />
          </Box>
          <Box className="formGroup">
            <label htmlFor="additionalInfo">
              <FormattedMessage id="form.additionalInfo.label" />
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              rows={4}
              className="formControl"
              placeholder={intl.formatMessage({ id: 'form.additionalInfo.placeholder' })}
            />
          </Box>
        </form>
      </Box>
    </Box>
  );
};
