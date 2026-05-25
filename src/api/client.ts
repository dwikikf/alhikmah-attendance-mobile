import axios from 'axios';
import { getToken, deleteToken } from '../utils/storage';

// In a real app, use environment variables (e.g., process.env.EXPO_PUBLIC_API_URL)
const API_BASE_URL = 'http://192.168.1.100:8080/api/v1'; // Replace with actual backend IP

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
client.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 Unauthorized (token expired)
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await deleteToken();
      // In a real app, you might want to trigger a global logout event here
    }
    return Promise.reject(error);
  }
);

export default client;
