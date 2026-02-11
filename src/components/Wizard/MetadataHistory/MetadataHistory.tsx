import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';
import { AutoDirectionBox } from '../../../common/AutoDirectionBox/AutoDirectionBox';
import { historyAPI, HistoryRecord } from '../../../common/services/HistoryService';
import { IDENTIFIER_FIELD, WizardStepProps } from '../Wizard.types';

import './MetadataHistory.css';
import { Curtain } from '../../../common/Curtain/curtain';

export const MetadataHistory: React.FC<WizardStepProps> = ({ setIsNextBtnDisabled, selectedItem }) => {
  const [historyItems, setHistoryItems] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsNextBtnDisabled(false);

    (async () => {
      try {
        const historyData = await historyAPI(selectedItem?.[IDENTIFIER_FIELD] as string, setIsLoading, true);
        setHistoryItems(historyData as HistoryRecord[]);
      }
      catch (e) {
        setIsNextBtnDisabled(true);
      }

    })();
  }, []);

  const sortedHistoryItems = [...historyItems].sort((a, b) =>
    b.authorizedAt.localeCompare(a.authorizedAt)
  );

  return (
    <Box className="historyContainer curtainContainer">
      <Box className="cardList">
        {
          !isLoading &&
          sortedHistoryItems.map((item, index) => (
            <Box key={item.id} className={`historyCard ${index === 0 ? 'active' : ''}`}>
              <Box className="cardHeader">
                <Typography tag="span" className="cardTitle">
                  <AutoDirectionBox>
                    {
                      new Date(item.authorizedAt).toLocaleString('he-IL', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    }
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
            <Curtain showProgress={true}/>
          </Box>
        }
      </Box>
    </Box>
  );
};
