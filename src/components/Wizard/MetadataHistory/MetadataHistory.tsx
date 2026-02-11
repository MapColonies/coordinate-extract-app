import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';
import { AutoDirectionBox } from '../../../common/AutoDirectionBox/AutoDirectionBox';
import { useI18n } from '../../../i18n/I18nProvider';
import appConfig from '../../../utils/Config';
import { formatDate } from '../../../utils/formatter';
import { requestExecutor } from '../../../utils/requestHandler';
import { mockHistory } from '../../common/MockData';
import { IDENTIFIER_FIELD, WizardStepProps } from '../Wizard.types';

import './MetadataHistory.css';

interface HistoryRecord {
  id: string;
  recordName: string;
  username: string;
  authorizedBy: string;
  action: string;
  authorizedAt: string;
}

export const MetadataHistory: React.FC<WizardStepProps> = ({ setIsNextBtnDisabled, selectedItem }) => {
  const [historyItems, setHistoryItems] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { locale } = useI18n();

  useEffect(() => {
    setIsNextBtnDisabled(false);

    const fetchData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await requestExecutor(
          {
            url: `${appConfig.extractableManagerUrl}/audit/${selectedItem?.[IDENTIFIER_FIELD]}`,
            injectToken: true
          },
          'GET',
          {}
        );
        setHistoryItems(response?.data ?? mockHistory);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortedHistoryItems = [...historyItems].sort((a, b) =>
    b.authorizedAt.localeCompare(a.authorizedAt)
  );

  return (
    <Box className="historyContainer">
      <Box className="cardList">
        {
          !isLoading &&
          sortedHistoryItems.map((item, index) => (
            <Box key={item.id} className={`historyCard ${index === 0 ? 'active' : ''}`}>
              <Box className="cardHeader">
                <Typography tag="span" className="cardTitle">
                  <AutoDirectionBox>
                    {formatDate(item.authorizedAt, locale, true)}
                  </AutoDirectionBox>
                </Typography>
                <Typography tag="span" className="cardSecondary">
                  {item.username}
                </Typography>
              </Box>
              <Box className={`cardContent ${item.action.toLowerCase() === 'create' ? 'green' : 'orange'}`}>
                <FormattedMessage
                  id={`history.action.${item.action.toLowerCase()}`}
                  values={{ value: item.authorizedBy }}
                />
              </Box>
            </Box>
          ))
        }
        {
          !isLoading &&
          historyItems.length === 0 &&
          <Box className="noData">
            <FormattedMessage id="general.noData" />
          </Box>
        }
        {
          isLoading &&
          <Box className="historyLoading">
            <FormattedMessage id="general.loading" />
          </Box>
        }
      </Box>
    </Box>
  );
};
