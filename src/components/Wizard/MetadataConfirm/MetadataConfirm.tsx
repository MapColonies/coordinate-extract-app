import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { TextField, Typography } from '@map-colonies/react-core';
import { IDENTIFIER_FIELD, WizardStepProps } from '../Wizard.types';

import './MetadataConfirm.css';

export const MetadataConfirm: React.FC<WizardStepProps> = ({ setIsNextBtnDisabled, selectedItem }) => {
  const intl = useIntl();

  const [formData, setFormData] = useState({
    password: ''
  });

  useEffect(() => {
    setIsNextBtnDisabled(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (value.trim() === '') {
      setIsNextBtnDisabled(true);
    } else {
      setIsNextBtnDisabled(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Metadata committed successfully!');
  };

  return (
    <Box className="metadataConfirm">
      <Box className="formContainer">
        <Box className="formHeader">
          {
            [
              intl.formatMessage({ id: "form.message.confirm.title" }),
              intl.formatMessage({ id: "form.message.confirm.model" }, { value: selectedItem?.[IDENTIFIER_FIELD] as unknown as string }),
              intl.formatMessage({ id: "form.message.confirm.action" }, { value: selectedItem?.isApproved ? intl.formatMessage({ id: 'form.message.confirm.reject' }) : intl.formatMessage({ id: 'form.message.confirm.approve' }) }),
              intl.formatMessage({ id: "form.message.confirm.approver" }, { value: selectedItem?.approver as string })
            ].map((line, index) => (
              <Typography 
                tag="div" 
                key={index} 
                className={index === 0 ? "title" : "line"}
              >
                {line}
              </Typography>
            ))
          }
        </Box>
        <form onSubmit={handleSubmit} className="form">
          <Box className="formGroup">
            <label htmlFor="password">
              <FormattedMessage id="form.password.label" />
            </label>
            <TextField
              type="text"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="textField"
              placeholder={intl.formatMessage({ id: 'form.password.placeholder' })}
            />
          </Box>
        </form>
      </Box>
    </Box>
  );
};
