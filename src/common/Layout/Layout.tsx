import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { RMWCProvider, ThemeProvider as RMWCThemeProvider, Themes } from '@map-colonies/react-core';
import version from '../../../package.json';
import { useI18n } from '../../i18n/I18nProvider';
import Routing from '../Routing/Routing';
import Header from '../Header/Header';

import './Layout.css';

const Layout: React.FC = (): JSX.Element => {
  const { locale } = useI18n();
  const intl = useIntl();

  useEffect(() => {
    document.title = intl.formatMessage({ id: 'app.title' }, { version: version.version });
  }, []);

  const camelize = (value: string): string => {
    return value
      .toLowerCase()
      .replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1: string, p2: string, offset) => {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();
      });
  };

  const CustomTheme = {
    lightTheme: {},
    darkTheme: {
      GC_PRIMARY: '#1976D2',
      GC_ALTERNATIVE_SURFACE: '#121212',
      GC_TAB_ACTIVE_BACKGROUND: '#455570',
      GC_SELECTION_BACKGROUND: '#455570',
      GC_HOVERED_BACKGROUND: 'rgba(33, 150, 243, 0.1)',
      GC_DISABLED_BACKGROUND: '#45557080',

      GC_SUCCESS: '#00B45A',
      GC_WARNING: '#FFA032',
      GC_ERROR: '#CC1616',

      GC_PRIORITY_HIGHEST: '#FF3636',
      GC_PRIORITY_HIGH: '#FE6814',
      GC_PRIORITY_NORMAL: '#00B45A',
      GC_PRIORITY_LOW: '#FFB932',
      GC_PRIORITY_LOWEST: '#00B6EE',

      GC_BORDER_RADIUS: '8px',
      GC_GAP: '12px',
      GC_FONT_SIZE: '14px',
      GC_TITLE_FONT_SIZE: '15px',
      GC_STEP_HEIGHT: '690px',
    },
  };

  const theme = {
    ...Themes.darkTheme,
    background: '#000',
    surface: '#000',
    border: '#1e293b',
    ...Object.fromEntries(
      Object.entries(CustomTheme.darkTheme).map(([key, value]) => [camelize(key), value])
    ),
  };

  ((): void => {
    if (locale === 'he') {
      document.body.dir = 'rtl';
    }
  })();

  return (
    <RMWCProvider
      typography={{
        body1: 'span',
        body2: ({ children, ...rest }): JSX.Element => (
          <span>
            <b>{children}</b>
          </span>
        ),
      }}
    >
      <RMWCThemeProvider className={`${theme.type}-theme`} options={theme}>
        <Box className="Layout">
          <header>
            <Header />
          </header>
          <main>
            <Routing />
          </main>
        </Box>
      </RMWCThemeProvider>
    </RMWCProvider>
  );
};

export default Layout;
