import client from './client';
import { saveToken, deleteToken } from '../utils/storage';

export interface LoginResponse {
  success: boolean;
  data?: {
    token: string;
    user: {
      id: string;
      username: string;
      full_name: string;
      role: string;
    };
  };
  message?: string;
  error?: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await client.post<LoginResponse>('/auth/login', {
      username,
      password,
    });
    
    if (response.data.success && response.data.data?.token) {
      await saveToken(response.data.data.token);
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data as LoginResponse;
    }
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await client.post('/auth/logout');
  } catch (error) {
    console.error('Logout API failed, continuing with local logout');
  } finally {
    await deleteToken();
  }
};
