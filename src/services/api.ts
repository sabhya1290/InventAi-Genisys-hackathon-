import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor: Attach JWT token ─────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('inventai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle 401 globally ────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale auth and redirect to login
      localStorage.removeItem('inventai_token');
      localStorage.removeItem('inventai_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
