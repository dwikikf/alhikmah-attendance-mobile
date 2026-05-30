import client from './client';
import { login, logout } from './auth';
import { saveToken, deleteToken } from '../utils/storage';

jest.mock('./client', () => ({
  post: jest.fn(),
}));

jest.mock('../utils/storage', () => ({
  saveToken: jest.fn(),
  deleteToken: jest.fn(),
}));

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('returns login response and saves token on success', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { token: 'test_token', user: { id: '1', username: 'test', full_name: 'Test User', role: 'admin' } },
        },
      };
      (client.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await login('test', 'password');

      expect(client.post).toHaveBeenCalledWith('/auth/login', { username: 'test', password: 'password' });
      expect(saveToken).toHaveBeenCalledWith('test_token');
      expect(result).toEqual(mockResponse.data);
    });

    it('returns error response when API returns error structure', async () => {
      const errorResponse = {
        response: {
          data: { success: false, error: 'Invalid credentials' }
        }
      };
      (client.post as jest.Mock).mockRejectedValueOnce(errorResponse);

      const result = await login('wrong', 'pass');
      expect(result).toEqual(errorResponse.response.data);
      expect(saveToken).not.toHaveBeenCalled();
    });

    it('throws error when no response data is available', async () => {
      const genericError = new Error('Network error');
      (client.post as jest.Mock).mockRejectedValueOnce(genericError);

      await expect(login('wrong', 'pass')).rejects.toThrow('Network error');
    });
  });

  describe('logout', () => {
    it('calls API and deletes local token', async () => {
      (client.post as jest.Mock).mockResolvedValueOnce({});

      await logout();

      expect(client.post).toHaveBeenCalledWith('/auth/logout');
      expect(deleteToken).toHaveBeenCalled();
    });

    it('deletes local token even if API fails', async () => {
      (client.post as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await logout();

      expect(client.post).toHaveBeenCalledWith('/auth/logout');
      expect(deleteToken).toHaveBeenCalled();
    });
  });
});
