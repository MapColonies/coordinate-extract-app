import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { TextField, Typography } from '@map-colonies/react-core';
import { WizardStepProps } from '../Wizard.types';

import './MetadataForm.css';

export const MetadataForm: React.FC<WizardStepProps> = ({ setIsNextBtnDisabled, selectedItem, setSelectedItem }) => {
  const intl = useIntl();

  const [formData, setFormData] = useState({
    approver: '',
    additionalInfo: ''
  });

  useEffect(() => {
    setIsNextBtnDisabled(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setSelectedItem?.({
      ...selectedItem,
       [name]: value
    });
    if (name === 'approver') {
      if (value.trim() === '') {
        setIsNextBtnDisabled(true);
      } else {
        setIsNextBtnDisabled(false);
      }
    } else if (formData.approver.trim() === '') {
      setIsNextBtnDisabled(true);
    } else {
      setIsNextBtnDisabled(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Metadata saved successfully!');
  };

  return (
    <Box className="metadataForm">
      <Box className="formContainer">
        <Box className={`formHeader ${selectedItem?.isApproved ? 'orange' : 'green'}`}>
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
            <TextField
              type="text"
              id="approver"
              name="approver"
              value={formData.approver}
              onChange={handleChange}
              required
              className="textField"
              placeholder={intl.formatMessage({ id: 'form.approver.placeholder' })}
              autoComplete="off"
            />
          </Box>
          <Box className="formGroup">
            <label htmlFor="additionalInfo">
              <FormattedMessage id="form.additionalInfo.label" />
            </label>
            <TextField
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              textarea={true}
              rows={4}
              placeholder={intl.formatMessage({ id: 'form.additionalInfo.placeholder' })}
            />
          </Box>
        </form>
      </Box>
    </Box>
  );
};
