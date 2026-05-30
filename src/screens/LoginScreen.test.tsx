import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from './LoginScreen';
import * as authApi from '../api/auth';
import { useNavigation } from '@react-navigation/native';

jest.mock('../api/auth', () => ({
  login: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders username and password inputs and login button', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    expect(getByPlaceholderText('Masukkan username Anda')).toBeTruthy();
    expect(getByPlaceholderText('Masukkan password')).toBeTruthy();
    expect(getByText('Masuk')).toBeTruthy();
  });

  it('shows alert when credentials are empty', () => {
    const { getByText } = render(<LoginScreen />);
    
    fireEvent.press(getByText('Masuk'));
    
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Silakan masukkan username dan password');
    expect(authApi.login).not.toHaveBeenCalled();
  });

  it('calls login API and navigates on success', async () => {
    (authApi.login as jest.Mock).mockResolvedValueOnce({ success: true });
    
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Masukkan username Anda'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Masukkan password'), 'password123');
    fireEvent.press(getByText('Masuk'));
    
    expect(authApi.login).toHaveBeenCalledWith('testuser', 'password123');
    
    await waitFor(() => {
      const nav = useNavigation();
      expect(nav.replace).toHaveBeenCalledWith('Scanner');
    });
  });

  it('shows alert on login failure', async () => {
    (authApi.login as jest.Mock).mockResolvedValueOnce({ success: false, message: 'Invalid pass' });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Masukkan username Anda'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Masukkan password'), 'wrong');
    fireEvent.press(getByText('Masuk'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Gagal Masuk', 'Invalid pass');
    });
  });
});
