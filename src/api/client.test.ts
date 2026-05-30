import client from './client';
import { getToken, deleteToken } from '../utils/storage';

jest.mock('../utils/storage', () => ({
  getToken: jest.fn(),
  deleteToken: jest.fn(),
}));

describe('API client interceptors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('request interceptor', () => {
    it('adds Authorization header if token exists', async () => {
      (getToken as jest.Mock).mockResolvedValue('test_token');
      
      const config = { headers: {} };
      // @ts-ignore
      const result = await client.interceptors.request.handlers[0].fulfilled(config);
      
      expect(getToken).toHaveBeenCalled();
      expect(result.headers.Authorization).toBe('Bearer test_token');
    });

    it('does not add Authorization header if token is missing', async () => {
      (getToken as jest.Mock).mockResolvedValue(null);
      
      const config = { headers: {} };
      // @ts-ignore
      const result = await client.interceptors.request.handlers[0].fulfilled(config);
      
      expect(getToken).toHaveBeenCalled();
      expect(result.headers.Authorization).toBeUndefined();
    });
  });

  describe('response interceptor', () => {
    it('returns response directly on success', async () => {
      const response = { data: 'ok' };
      // @ts-ignore
      const result = await client.interceptors.response.handlers[0].fulfilled(response);
      expect(result).toBe(response);
    });

    it('deletes token and rejects if response status is 401', async () => {
      const error = { response: { status: 401 } };
      
      // @ts-ignore
      await expect(client.interceptors.response.handlers[0].rejected(error)).rejects.toEqual(error);
      expect(deleteToken).toHaveBeenCalled();
    });

    it('just rejects if response status is not 401', async () => {
      const error = { response: { status: 500 } };
      
      // @ts-ignore
      await expect(client.interceptors.response.handlers[0].rejected(error)).rejects.toEqual(error);
      expect(deleteToken).not.toHaveBeenCalled();
    });
  });
});
