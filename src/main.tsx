import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './router.tsx';
import { Provider } from 'react-redux';
import store from './store.tsx';
import { ConfigProvider } from 'antd';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ConfigProvider theme={{ token: { colorPrimary: '#5f85c1' } }}>
			<Provider store={store}>
				<RouterProvider router={router} />
			</Provider>
		</ConfigProvider>
	</StrictMode>
);
