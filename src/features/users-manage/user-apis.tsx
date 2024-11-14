import { AxiosResponse } from 'axios';
import { TCreateUser, TUpdateUser, User } from '../data.type';
import { instance } from '../login/login.api';

export const createUser = async (
  user: TCreateUser
): Promise<
  AxiosResponse<{
    success: boolean;
    message: { user_exist: boolean; user_id: string };
  }>
> => {
  return await instance
    .post('/user/create', user, { headers: { roles: ['admin'] } })
    .catch(e => {
      throw new Error(e);
    });
};

export const updateUser = async (
  user: TUpdateUser
): Promise<
  AxiosResponse<{
    success: boolean;
  }>
> => {
  return await instance
    .post(
      `/user/update/${user.id}`,
      { user },
      { headers: { roles: ['admin'] } }
    )
    .catch(e => {
      throw new Error(e);
    });
};

export const fetchUsersList = async (): Promise<AxiosResponse<User[]>> => {
  return await instance
    .get('/user/all', { headers: { roles: ['admin'] } })
    .catch(e => {
      throw new Error(e);
    });
};
