import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { lazy, ReactNode } from 'react';

export const Home = lazy(() => import('./features/home/home'));
export const UploadFile = lazy(
  () => import('./features/upload-file/upload-file')
);
export const DeviceControl = lazy(
  () => import('./features/device-control/device-control')
);
export const UserList = lazy(() => import('./features/users-manage/user-list'));
export const SessionTimeout = lazy(
  () => import('./features/error-page/session-timeout')
);
export const Threejs = lazy(() => import('./features/threejs/threejs'));
export const Temp = lazy(() => import('./features/temp'));

export function AuthGuard({ children }: { children: ReactNode }) {
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
