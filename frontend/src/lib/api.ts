import axios, { type InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
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

export function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  const err = error as { response?: { data?: { message?: string } | string }; message?: string };
  const payload = err?.response?.data;

  if (typeof payload === 'string' && payload.trim().length > 0) {
    return payload;
  }

  if (payload && typeof payload === 'object' && 'message' in payload && typeof (payload as Record<string, unknown>).message === 'string') {
    return (payload as { message: string }).message;
  }

  if (err?.message && typeof err.message === 'string') {
    return err.message;
  }

  return fallbackMessage;
}
