import { ActionFunctionArgs, json } from 'react-router-dom';
import { login, logout } from './features/login/login.api';

export const devicePageAction = async () => {
  return json({});
};

export const loginPageAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as {
    phone: string;
    password: string;
    logout: string;
    email: string;
  };
  if (data.logout && data.email) {
    await logout(data.email);
    return json({ userLogin: false });
  }
  const res = await login(data.email, data.password);
  if (res.success && res.login_success) {
    localStorage.setItem('user_id', res.user_id);
    return json({ success: true, userId: res.user_id });
  } else {
    return json({ error: { password: '密码错误!' } });
  }
};
