import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
