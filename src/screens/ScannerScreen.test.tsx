import React from 'react';
import { render } from '@testing-library/react-native';
import ScannerScreen from './ScannerScreen';

describe('ScannerScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByText } = render(<ScannerScreen />);
    // useCameraPermissions mocked in setupTests returns granted: true
    expect(getByText('Arahkan QR Code siswa ke dalam kotak')).toBeTruthy();
  });
});
