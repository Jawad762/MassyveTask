import axios from 'axios';
import { store } from './components/Shared/ReduxProvider';
import { API_URL } from './constants';

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
                return api(originalRequest);
            } catch (err) {
                window.location.href = '/auth/login'
                store.dispatch({ type: 'LOGOUT' });
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);
