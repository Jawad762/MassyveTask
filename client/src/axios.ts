import axios from 'axios';
import { store } from './components/Shared/ReduxProvider';

export const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

// intercept the api response below, if we recieve a 401 response,
// we know that our access token is expired and we request a new one
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axios.post(`/api/auth/refresh-token`, {}, { withCredentials: true });
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
