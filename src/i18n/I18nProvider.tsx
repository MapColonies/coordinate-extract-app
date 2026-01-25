import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import appConfig from '../Utils/Config';
import enMessages from './locales/en.json';
import heMessages from './locales/he.json';

type Locale = 'en' | 'he';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const messages: Record<Locale, any> = {
  en: enMessages,
  he: heMessages,
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>((appConfig.language as Locale) || 'he');

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      <IntlProvider locale={locale} messages={messages[locale]} defaultLocale="he">
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};
