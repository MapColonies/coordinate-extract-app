import React, { useEffect } from 'react';
import { RMWCProvider, ThemeProvider as RMWCThemeProvider, Themes } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import version from '../../../package.json';
import { useI18n } from '../../i18n/I18nProvider';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Routing from '../Routing/Routing';

import './Layout.css';

const Layout: React.FC = (): JSX.Element => {
  const { locale } = useI18n();

  useEffect(() => {
    document.title = `MapColonies App - v${version.version}`;
  }, []);

  const camelize = (value: string): string => {
    return value.toLowerCase().replace(
      /^([A-Z])|[\s-_]+(\w)/g,
      (match, p1: string, p2: string, offset) => {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();
      }
    );
  };

  const CustomTheme = {
    lightTheme: {},
    darkTheme: {
      GC_BUTTON_DISABLED_BACKGROUND: '#45557080',
  
      GC_TAB_ACTIVE_BACKGROUND: '#455570',
      GC_ALTERNATIVE_SURFACE: '#2D3748',
  
      GC_SELECTION_BACKGROUND: '#455570',
      GC_HOVER_BACKGROUND: 'rgba(33, 150, 243, 0.1)',
  
      GC_WARNING_HIGH: '#FFA032', /* Orange */
      GC_WARNING_MEDIUM: '#FFEB87', /* Yellow */
      GC_SUCCESS: 'green',
      GC_ERROR_HIGH: '#CC1616', /* Dark Red */
      GC_ERROR_MEDIUM: '#FF3636', /* Red */
  
      GC_PRIORITY_HIGHEST: '#FF3636', /* Dark Red */
      GC_PRIORITY_HIGH: '#FE6814', /* Orange */
      GC_PRIORITY_NORMAL: '#00B45A', /* Green */
      GC_PRIORITY_LOW: '#FFB932', /* Yellow */
      GC_PRIORITY_LOWEST: '#00B6EE', /* Light Blue */
  
      GC_MENU_ITEM_HEIGHT: '32px',
      GC_CONTEXT_MENU_WIDTH: '260px',
    },
  };

  const theme = {
    ...Themes.darkTheme,
    background: '#000',
    surface: '#000',
    alternativeSurface: '#121212',
    ...(Object.fromEntries(Object.entries(CustomTheme.darkTheme).map(([key, value]) => [camelize(key), value])))
  };

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

        <Box className="Layout" dir={locale === 'he' ? 'rtl' : 'ltr'}>

          <header>
            <Header />
          </header>

          <main>
            <Routing />
          </main>

          <footer>
            <Footer />
          </footer>

        </Box>

      </RMWCThemeProvider>
    </RMWCProvider>
  );
  
};

export default Layout;
