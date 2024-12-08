import { createBrowserRouter } from 'react-router-dom';
import App from './App';
// import ErrorPage from './features/error-page/error-page';
import { Suspense } from 'react';
import Skeleton from 'antd/es/skeleton';
import {
  devicePageLoader,
  homePageLoader,
  loginPageLoader,
  userListPageLoader,
} from './loader';
import { devicePageAction, loginPageAction } from './action';
import {
  AuthGuard,
  DeviceControl,
  Home,
  SessionTimeout,
  Temp,
  Threejs,
  UploadFile,
  UserList,
} from './module-lazy-load';

const router = createBrowserRouter([
  {
    path: '',
    element: <App />,
    loader: loginPageLoader,
    // errorElement: <ErrorPage />,
  },
  {
    path: 'login',
    element: <App />,
    loader: loginPageLoader,
    action: loginPageAction,
    // errorElement: <ErrorPage />,
  },
  {
    path: 'home',
    element: (
      <Suspense fallback={<Skeleton />}>
        <Home />
      </Suspense>
    ),
    loader: homePageLoader,
    children: [
      {
        path: 'upload-file',
        element: (
          <Suspense fallback={<Skeleton />}>
            <UploadFile />
          </Suspense>
        ),
        // errorElement: <ErrorPage />,
      },
      {
        path: 'device-control',
        loader: devicePageLoader,
        action: devicePageAction,
        element: (
          <Suspense fallback={<Skeleton />}>
            <AuthGuard>
              <DeviceControl />
            </AuthGuard>
          </Suspense>
        ),
        // // errorElement: <ErrorPage />,
      },
      {
        path: 'user-list',
        loader: userListPageLoader,
        element: (
          <Suspense fallback={<Skeleton />}>
            <AuthGuard>
              <UserList />
            </AuthGuard>
          </Suspense>
        ),
        // errorElement: <ErrorPage />,
      },
      {
        path: 'threejs',
        element: (
          <Suspense fallback={<Skeleton />}>
            <Threejs />
          </Suspense>
        ),
        // errorElement: <ErrorPage />,
      },
      {
        path: 'temp',
        element: (
          <Suspense fallback={<Skeleton />}>
            <Temp />
          </Suspense>
        ),
        // errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: 'session-timeout',
    element: (
      <Suspense fallback={<Skeleton />}>
        <SessionTimeout />
      </Suspense>
    ),
  },
]);

export default router;
