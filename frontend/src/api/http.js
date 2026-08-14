import axios from 'axios';
import router from '../router';
import { useAuth } from '../composables/useAuth';

const http = axios.create({
  baseURL: '/api',
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuth().logout();
      if (router.currentRoute.value.name !== 'login') {
        router.push({ name: 'login' });
      }
    }
    return Promise.reject(error);
  }
);

export default http;
