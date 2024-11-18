import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import App from './App';
import ErrorPage from './features/error-page/error-page';
import { loader as homeLoader } from './features/home/home';
import {
  loader as loginLoader,
  action as loginAction,
} from './features/login/login';
import {
  loader as deviceControlLoader,
  action as deviceControlAction,
} from './features/device-control/device-control';
import { loader as uploadFileLoader } from './features/upload-file/upload-file';
import { loader as userListLoader } from './features/users-manage/user-list';
import { lazy, ReactNode, Suspense } from 'react';
import Skeleton from 'antd/es/skeleton';
import { useSelector } from 'react-redux';

const Home = lazy(() => import('./features/home/home'));
const UploadFile = lazy(() => import('./features/upload-file/upload-file'));
const DeviceControl = lazy(
  () => import('./features/device-control/device-control')
);
const UserList = lazy(() => import('./features/users-manage/user-list'));
const SessionTimeout = lazy(
  () => import('./features/error-page/session-timeout')
);
const Threejs = lazy(() => import('./features/threejs/threejs'));
const Temp = lazy(() => import('./features/temp'));

function AuthGuard({ children }: { children: ReactNode }) {
  const userLogin = useSelector<{ login: { userLogin: boolean } }>(
    state => state.login.userLogin
  );
  const location = useLocation();
  return userLogin ? (
    <>{children}</>
  ) : (
    <>
      <Navigate to='/login' replace state={{ from: location }}></Navigate>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '',
    element: <App />,
    loader: loginLoader,
    errorElement: <ErrorPage />,
  },
  {
    path: 'login',
    element: <App />,
    loader: loginLoader,
    action: loginAction,
    errorElement: <ErrorPage />,
  },
  {
    path: 'home',
    element: (
      <Suspense fallback={<Skeleton />}>
        <Home />
      </Suspense>
    ),
    loader: homeLoader,
    children: [
      {
        path: 'upload-file',
        loader: uploadFileLoader,
        element: (
          <Suspense fallback={<Skeleton />}>
            <UploadFile />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: 'device-control',
        loader: deviceControlLoader,
        action: deviceControlAction,
        element: (
          <Suspense fallback={<Skeleton />}>
            <AuthGuard>
              <DeviceControl />
            </AuthGuard>
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: 'user-list',
        loader: userListLoader,
        element: (
          <Suspense fallback={<Skeleton />}>
            <AuthGuard>
              <UserList />
            </AuthGuard>
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: 'threejs',
        element: (
          <Suspense fallback={<Skeleton />}>
            <Threejs />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: 'temp',
        element: (
          <Suspense fallback={<Skeleton />}>
            <Temp />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
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
