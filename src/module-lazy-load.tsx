import { lazy } from 'react';

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
