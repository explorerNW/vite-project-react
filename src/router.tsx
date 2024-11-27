import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import App from './App';
// import ErrorPage from './features/error-page/error-page';
import { lazy, ReactNode, Suspense } from 'react';
import Skeleton from 'antd/es/skeleton';
import { useSelector } from 'react-redux';
import {
  devicePageLoader,
  homePageLoader,
  loginPageLoader,
  userListPageLoader,
} from './loader';
import { devicePageAction, loginPageAction } from './action';

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
