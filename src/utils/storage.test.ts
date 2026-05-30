import * as SecureStore from 'expo-secure-store';
import { saveToken, getToken, deleteToken } from './storage';

const TOKEN_KEY = 'jwt_auth_token';

describe('storage utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveToken', () => {
    it('calls SecureStore.setItemAsync with correct key and value', async () => {
      const token = 'fake_token_123';
      await saveToken(token);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(TOKEN_KEY, token);
    });
  });

  describe('getToken', () => {
    it('returns stored token on success', async () => {
      const mockToken = 'fake_token_123';
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(mockToken);
      
      const result = await getToken();
      
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith(TOKEN_KEY);
      expect(result).toBe(mockToken);
    });

    it('returns null when getItemAsync throws an error', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));
      
      const result = await getToken();
      
      expect(result).toBeNull();
    });
  });

  describe('deleteToken', () => {
    it('calls SecureStore.deleteItemAsync with correct key', async () => {
      await deleteToken();
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(TOKEN_KEY);
    });
  });
});
