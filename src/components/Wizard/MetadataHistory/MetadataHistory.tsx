import React, { useEffect, useState } from 'react';
import { Box } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';
import { FormattedMessage } from 'react-intl';
import appConfig from '../../../utils/Config';
import { requestExecutor } from '../../../utils/requestHandler';
import { mockExtractableRecords } from '../../common/CatalogMockData';
import { IDENTIFIER_FIELD, WizardStepProps } from '../Wizard.types';

import './MetadataHistory.css';

interface HistoryRecord {
  id: string;
  recordName: string;
  authorizedBy: string;
  data: {
    description: string;
  };
}

export const MetadataHistory: React.FC<WizardStepProps> = ({ setIsNextBtnDisabled, selectedItem }) => {
  const [historyItems, setHistoryItems] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsNextBtnDisabled(false);
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await requestExecutor({
          url: `${appConfig.extractableManagerUrl}/${selectedItem?.[IDENTIFIER_FIELD]}`,
          injectToken: true
        }, 'GET', {});
        setHistoryItems(response?.data || mockExtractableRecords);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <Box className="historyLoading"><FormattedMessage id="general.loading" /></Box>;
  }

  return (
    <Box className="historyContainer">
      <Box className="cardList">
        {
          historyItems.map((item) => (
            <Box key={item.id} className="historyCard">
              <Box className="cardHeader">
                <Typography tag="span" className="recordName">
                  {item.recordName}
                </Typography>
                <Typography tag="span" className="authorizedBy">
                  {item.authorizedBy}
                </Typography>
              </Box>
              <Box className="cardContent">
                <Typography tag="p" className="description">
                  {item.data.description}
                </Typography>
              </Box>
              <Box className="cardFooter">
                <Typography tag="small" className="recordId">
                  ID: {item.id}
                </Typography>
              </Box>
            </Box>
          ))
        }
        {
          historyItems.length === 0 &&
          <Typography tag="p" className="noData">
            <FormattedMessage id="general.noData" />
          </Typography>
        }
      </Box>
    </Box>
  );
};
