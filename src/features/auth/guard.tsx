import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

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
