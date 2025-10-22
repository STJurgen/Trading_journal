import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

let accessToken = null;
let refreshToken = null;
const unauthorizedListeners = new Set();

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      accessToken = null;
      refreshToken = null;
      unauthorizedListeners.forEach((listener) => {
        try {
          listener();
        } catch (listenerError) {
          console.error('Unauthorized listener failed', listenerError);
        }
      });
    }
    return Promise.reject(error);
  }
);

export const setAuthTokens = ({ access, refresh }) => {
  accessToken = access || null;
  refreshToken = refresh || null;
};

export const getRefreshToken = () => refreshToken;

export const clearAuthTokens = () => {
  accessToken = null;
  refreshToken = null;
};

export const onUnauthorized = (callback) => {
  unauthorizedListeners.add(callback);
  return () => unauthorizedListeners.delete(callback);
};

export default api;
