import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Common/Layout/Layout';
import { I18nProvider } from './i18n/I18nProvider';
import reportWebVitals from './reportWebVitals';
import appConfig from './Utils/Config';

import './index.css';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <BrowserRouter basename={appConfig.publicUrl}>
    <I18nProvider>
      <Layout />
    </I18nProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
