import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'jwt_auth_token';

/**
 * Saves the JWT token to secure storage.
 * @param token The JWT token to save
 */
export async function saveToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save token to SecureStore', error);
  }
}

/**
 * Retrieves the JWT token from secure storage.
 * @returns The token string or null if not found
 */
export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get token from SecureStore', error);
    return null;
  }
}

/**
 * Removes the JWT token from secure storage.
 */
export async function deleteToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to delete token from SecureStore', error);
  }
}
