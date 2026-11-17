import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token from localStorage if available (dual fallback with cookies)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for centralized error message extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// Auth Service
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// News Service
export const newsAPI = {
  getNews: (params) => api.get('/news', { params }),
  getNewsById: (id) => api.get(`/news/${id}`),
  createNews: (formData) =>
    api.post('/news', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateNews: (id, formData) =>
    api.put(`/news/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteNews: (id) => api.delete(`/news/${id}`),
  addComment: (articleId, commentData) =>
    api.post(`/news/${articleId}/comments`, commentData),
};

// Categories Service
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Users / Authors Service
export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Comments Moderation Service
export const commentAPI = {
  getAll: (params) => api.get('/comments', { params }),
  updateStatus: (id, status) => api.put(`/comments/${id}/status`, { status }),
  delete: (id) => api.delete(`/comments/${id}`),
};

// Settings Service
export const settingAPI = {
  getSettings: () => api.get('/settings'),
  saveSettings: (formData) =>
    api.post('/settings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Dashboard Stats Service
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

// Common Layout Data Service
export const commonAPI = {
  getCommonData: () => api.get('/common'),
};

export default api;
