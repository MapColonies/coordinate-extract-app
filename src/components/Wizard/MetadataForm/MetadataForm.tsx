import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { TextField, Typography } from '@map-colonies/react-core';
import { WizardStepProps } from '../Wizard.types';
import { ExclamationSVGIcon } from '../../../common/icons/ExclamationSVGIcon';

import './MetadataForm.css';

export const MetadataForm: React.FC<WizardStepProps> = ({ setIsNextBtnDisabled, selectedItem, setSelectedItem }) => {
  const intl = useIntl();

  const [formData, setFormData] = useState<{ approver: string; additionalInfo: string }>({
    approver: typeof selectedItem?.approver === 'string' ? selectedItem.approver : '',
    additionalInfo: typeof selectedItem?.additionalInfo === 'string' ? selectedItem.additionalInfo : ''
  });

  useEffect(() => {
    setIsNextBtnDisabled(selectedItem?.approver ? false : true);
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

  return (
    <Box className="metadataForm">
      <Box className="formContainer">
        <Box className={`formHeader ${selectedItem?.isApproved ? 'orange' : 'green'}`}>
          <Typography tag="span">
            <ExclamationSVGIcon color="currentColor" />
          </Typography>
          <FormattedMessage id={`${selectedItem?.isApproved ? 'form.message.reject' : 'form.message.approve'}`} />
        </Box>
        <form className="form">
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
