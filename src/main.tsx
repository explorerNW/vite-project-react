import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './router.tsx';
import { Provider } from 'react-redux';
import store from './store.tsx';
import { ConfigProvider } from 'antd';

import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://11878e9bb0e24359a9d6f7835202c44a@o346007.ingest.us.sentry.io/2068371',
  integrations: [],
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={{ token: { colorPrimary: '#5f85c1' } }}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ConfigProvider>
  </StrictMode>
);
