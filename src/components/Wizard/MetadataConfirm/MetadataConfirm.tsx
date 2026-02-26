import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { TextField, Typography } from '@map-colonies/react-core';
import { Curtain } from '../../../common/Curtain/curtain';
import { useAuth } from '../../../common/Routing/Login/AuthContext';
import {
  extractableCreateAPI,
  extractableDeleteAPI,
} from '../../../common/services/ExtractableService';
import { IDENTIFIER_FIELD, WizardStepProps } from '../Wizard.types';

import './MetadataConfirm.css';

export const MetadataConfirm: React.FC<WizardStepProps> = ({
  setIsNextBtnDisabled,
  selectedItem,
  shouldSubmit,
  setShouldSubmit,
  setIsCompleted,
}) => {
  const [formData, setFormData] = useState({ password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const intl = useIntl();

  useEffect(() => {
    setIsNextBtnDisabled(true);
  }, []);

  useEffect(() => {
    if (!shouldSubmit) {
      return;
    }
    let isMounted = true;
    const submit = async (): Promise<void> => {
      if (!selectedItem || !user?.username || !formData.password || !selectedItem.approver) {
        return;
      }
      const id = selectedItem[IDENTIFIER_FIELD] as string;
      const apiCall = selectedItem.isApproved ? extractableDeleteAPI : extractableCreateAPI;
      const response = await apiCall(
        id,
        user.username,
        formData.password,
        selectedItem.approver as string,
        selectedItem.remarks as string,
        {},
        setIsLoading
      );
      if (response && isMounted) {
        setIsCompleted?.(true);
      } else {
        setShouldSubmit?.(false);
        setIsNextBtnDisabled(true);
      }
    };
    void submit();
    return () => {
      isMounted = false;
    };
  }, [shouldSubmit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (value.trim() === '') {
      setIsNextBtnDisabled(true);
    } else {
      setIsNextBtnDisabled(false);
    }
  };

  return (
    <Box className="metadataConfirm">
      <Box className="formContainer curtainContainer">
        {isLoading && <Curtain showProgress={true} />}
        <Box className="formHeader">
          <Typography tag="div" className="title">
            <FormattedMessage id="form.message.confirm.title" />
          </Typography>
          <Typography tag="div" className="line">
            <FormattedMessage
              id="form.message.confirm.model"
              values={{ value: selectedItem?.[IDENTIFIER_FIELD] }}
            />
          </Typography>
          <Typography tag="div" className="line">
            <FormattedMessage
              id="form.message.confirm.action"
              values={{
                value: (
                  <Typography tag="span" className={selectedItem?.isApproved ? 'orange' : 'green'}>
                    {selectedItem?.isApproved
                      ? intl.formatMessage({ id: 'form.message.confirm.reject' })
                      : intl.formatMessage({ id: 'form.message.confirm.approve' })}
                  </Typography>
                ),
              }}
            />
          </Typography>
          {
            [
              intl.formatMessage(
                { id: 'form.message.confirm.approver' },
                { value: selectedItem?.approver as string }
              ),
              intl.formatMessage(
                { id: 'form.message.confirm.remarks' },
                { value: selectedItem?.remarks as string }
              )
            ].map((line, index) => (
              <Typography tag="div" key={index} className="line">
                {line}
              </Typography>
            ))
          }
        </Box>
        <form className="form">
          <Box className="formGroup">
            <label htmlFor="password">
              <FormattedMessage id="form.password.label" />
            </label>
            <TextField
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="textField"
              placeholder={intl.formatMessage({ id: 'form.password.placeholder' })}
              autoComplete="off"
            />
          </Box>
        </form>
      </Box>
    </Box>
  );
};
