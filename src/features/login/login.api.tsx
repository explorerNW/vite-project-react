import axios from 'axios';
import environment from '../../environments/local.environment';
import { User } from '../data';

export const instance = axios.create({
    baseURL: `http://${environment.apiHost}`,
});

instance.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        const token = localStorage.getItem('token');
        config.headers.setAuthorization(`${token}`);
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        console.log(error);
        if (error?.response?.data?.message) {
            const message = error?.response?.data?.message;
            if (
                (message?.authorization === false && message?.expired) ||
                message?.authorization === false
            ) {
                localStorage.removeItem('user_id');
                localStorage.removeItem('token');
                window.location.href = '/session-timeout';
            }
        }
        return Promise.reject(error);
    }
);

export const login = async (email: string, password: string) => {
    const res = await instance.post(`/auth/login`, {
        user: { email, password },
    });
    instance.defaults.headers.common['Authorization'] =
        `Bearer ${res?.data?.access_token}`;
    localStorage.setItem('token', `Bearer ${res?.data?.access_token}`);
    instance.defaults.headers.common['Content-Type'] = 'application/json';
    return res?.data;
};

export const logout = async (email: string) => {
    const res = await instance.post(`/auth/logout`, { email });
    instance.defaults.headers.common['Authorization'] = ``;
    localStorage.setItem('token', '');
    return res?.data;
};

export const getCurrentUser = async (id: string): Promise<User> => {
    const res = await instance.get(`/user/${id}`);
    return res?.data;
};
