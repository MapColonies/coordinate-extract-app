import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { TextField, Typography } from '@map-colonies/react-core';
import { WizardStepProps } from '../Wizard.types';
import { ExclamationSVGIcon } from '../../../common/icons/ExclamationSVGIcon';

import './MetadataForm.css';

export const MetadataForm: React.FC<WizardStepProps> = ({
  setIsNextBtnDisabled,
  selectedItem,
  setSelectedItem,
}) => {
  const intl = useIntl();

  const [formData, setFormData] = useState<{ approver: string; remarks: string }>({
    approver: typeof selectedItem?.approver === 'string' ? selectedItem.approver : '',
    remarks: typeof selectedItem?.remarks === 'string' ? selectedItem.remarks : '',
  });

  useEffect(() => {
    setIsNextBtnDisabled(selectedItem?.approver ? false : true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSelectedItem?.({
      ...selectedItem,
      [name]: value,
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
          <FormattedMessage
            id={`${selectedItem?.isApproved ? 'form.message.reject' : 'form.message.approve'}`}
          />
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
            <label htmlFor="remarks">
              <FormattedMessage id="form.remarks.label" />
            </label>
            <TextField
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              textarea={true}
              rows={4}
              placeholder={intl.formatMessage({ id: 'form.remarks.placeholder' })}
            />
          </Box>
        </form>
      </Box>
    </Box>
  );
};
