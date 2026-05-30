import client from './client';
import { submitAttendance } from './attendance';

jest.mock('./client', () => ({
  post: jest.fn(),
}));

describe('Attendance API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('submitAttendance', () => {
    it('returns success response on successful submission', async () => {
      const mockResponse = {
        data: { success: true, message: 'Attendance recorded' }
      };
      (client.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await submitAttendance('12345');

      expect(client.post).toHaveBeenCalledWith('/attendances/qr-scan', { nisn: '12345' });
      expect(result).toEqual(mockResponse.data);
    });

    it('returns error from API response', async () => {
      const errorResponse = {
        response: {
          data: { success: false, message: 'Invalid NISN' }
        }
      };
      (client.post as jest.Mock).mockRejectedValueOnce(errorResponse);

      const result = await submitAttendance('wrong');

      expect(client.post).toHaveBeenCalledWith('/attendances/qr-scan', { nisn: 'wrong' });
      expect(result).toEqual(errorResponse.response.data);
    });

    it('throws generic error when network fails', async () => {
      (client.post as jest.Mock).mockRejectedValueOnce(new Error('Network failure'));

      await expect(submitAttendance('12345')).rejects.toThrow('Terjadi kesalahan jaringan saat menghubungi server.');
    });
  });
});
