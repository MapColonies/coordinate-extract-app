import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Layout from './common/Layout/Layout';
import { I18nProvider } from './i18n/I18nProvider';
import reportWebVitals from './reportWebVitals';
import appConfig from './utils/Config';
import { AuthProvider } from './common/Routing/Login/auth-context';

import '@map-colonies/react-core/dist/button/styles';
import '@map-colonies/react-core/dist/textfield/styles';
import './dark-theme.css';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <BrowserRouter basename={appConfig.publicUrl}>
    <AuthProvider>
      <I18nProvider>
        <Layout />
      </I18nProvider>
    </AuthProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
