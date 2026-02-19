import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { Typography } from '@map-colonies/react-core';
import { AutoDirectionBox } from '../../../common/AutoDirectionBox/AutoDirectionBox';
import { Curtain } from '../../../common/Curtain/curtain';
import { historyAPI, HistoryRecord } from '../../../common/services/HistoryService';
import { useI18n } from '../../../i18n/I18nProvider';
import { formatDate } from '../../../utils/formatter';
import { IDENTIFIER_FIELD, WizardStepProps } from '../Wizard.types';

import './MetadataHistory.css';

export const MetadataHistory: React.FC<WizardStepProps> = ({ setIsNextBtnDisabled, selectedItem }) => {
  const [historyItems, setHistoryItems] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { locale } = useI18n();

  useEffect(() => {
    setIsNextBtnDisabled(false);
    (async () => {
      try {
        const historyData = await historyAPI(selectedItem?.[IDENTIFIER_FIELD] as string, setIsLoading);
        setHistoryItems(historyData as HistoryRecord[]);
      } catch (e) {
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
          isLoading &&
          <Box className="historyLoading">
            <FormattedMessage id="general.loading" />
            <Curtain showProgress={true}/>
          </Box>
        }
        {
          !isLoading &&
          historyItems.length === 0 &&
          <Box className="noData">
            <FormattedMessage id="general.noData" />
          </Box>
        }
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
      </Box>
    </Box>
  );
};
