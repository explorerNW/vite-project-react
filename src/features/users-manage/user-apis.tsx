import { AxiosResponse } from 'axios';
import { TCreateUser, TDeleteUser, TUpdateUser, User } from '../data.type';
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

export const deleteUser = async (
  user: TDeleteUser
): Promise<AxiosResponse<boolean>> => {
  return await instance
    .delete(`/user/${user.id}`, { headers: { roles: ['admin'] } })
    .then(res => res.data.success)
    .catch(e => {
      throw new Error(e);
    });
};

export const fetchUsersList = async (
  start: number = 0,
  end: number = 10
): Promise<AxiosResponse<{ users: User[]; totalLength: number }>> => {
  return await instance
    .get(`/user/all?start=${start}&end=${end}`, {
      headers: { roles: ['admin'] },
    })
    .catch(e => {
      throw new Error(e);
    });
};

export const searchUser = async (
  value: string
): Promise<AxiosResponse<{ users: User[]; totalLength: number }>> => {
  return await instance
    .get(`/user/findByLike?value=${value}`, { headers: { roles: ['admin'] } })
    .catch(e => {
      throw new Error(e);
    });
};
