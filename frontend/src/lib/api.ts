import axios, { type InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:80',
});

// Interceptor para injetar token JWT se disponível
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para telemetria e logs de erro
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    const path = error.config?.url;

    const responseBodyPreview = error.response?.data
      ? (typeof error.response.data === 'string'
          ? error.response.data.slice(0, 100)
          : JSON.stringify(error.response.data).slice(0, 100))
      : undefined;

    console.error(`[API Error] ${status || 'Network'} on ${path}: ${message}`, {
      responseStatus: status,
      responseHeaders: error.response?.headers,
      responseBodyPreview: responseBodyPreview || (error.response?.data ? "<redacted>" : undefined),
      config: {
        method: error.config?.method,
        url: error.config?.url,
        timeout: error.config?.timeout
      }
    });

    return Promise.reject(error);
  }
);

export default api;
