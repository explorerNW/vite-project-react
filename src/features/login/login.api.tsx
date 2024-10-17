import axios from "axios";
import environment from "../../environments/local.environment";

export const instance = axios.create({
    baseURL: `http://${environment.apiHost}`
});

export const login = async (email: string, password: string) => {
    const res = await instance.post(`/auth/login`, { user: { email, password } });
    instance.defaults.headers.common["Authorization"] = `Bearer ${res.data.access_token}`;
    instance.defaults.headers.common["Content-Type"] = "application/json";
    return res.data;
};