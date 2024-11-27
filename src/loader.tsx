import { json } from 'react-router-dom';
import { getCurrentUser } from './features/login/login.api';

export const devicePageLoader = async () => {
  return json({});
};

export const homePageLoader = async () => {
  const userId = localStorage.getItem('user_id');
  if (userId) {
    const user = await getCurrentUser(userId);
    return json({ user });
  }

  return json({ userLogout: true });
};

export const uploadFilePageLoader = async () => {
  return {};
};

export const userListPageLoader = () => {
  return {};
};

export const loginPageLoader = async () => {
  const userId = localStorage.getItem('user_id');
  if (userId) {
    const user = await getCurrentUser(userId);
    return json({ user });
  }

  return json({ userLogout: true });
};
