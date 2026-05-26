import axios from 'axios';
import { NativeModules } from 'react-native';
import { getToken, deleteToken } from '../utils/storage';

const getApiUrl = () => {
  // 1. Always prioritize explicit environment variables (Local / Production .env)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Auto-detect IP ONLY during development mode to prevent wifi issues
  if (__DEV__) {
    let devIp = '127.0.0.1';
    const scriptURL = NativeModules.SourceCode?.scriptURL;
    if (scriptURL) {
      const match = scriptURL.match(/https?:\/\/([^:]+)/);
      if (match) {
        return `http://${match[1]}:8080/api/v1`;
      }
    }
    return 'http://127.0.0.1:8080/api/v1';
  }

  // 3. Production Fallback: Ensure no local IPs are used in release builds
  // (Replace this with the real domain once deployed)
  return 'https://api.alhikmah-absensi.com/api/v1';
};

const API_BASE_URL = getApiUrl();

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
