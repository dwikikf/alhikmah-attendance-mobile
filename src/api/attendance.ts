import client from './client';

export interface AttendanceSubmission {
  qr_code_data: string;
  // This matches what the PRD mentions: "Sistem ekstrak NISN+Kelas+Tanggal dari QR"
  // For now, passing raw QR data to the backend is usually best,
  // let the backend decode/validate it.
}

export interface AttendanceResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const submitAttendance = async (qrData: string): Promise<AttendanceResponse> => {
  try {
    const response = await client.post<AttendanceResponse>('/attendances/qr-scan', {
      qr_code_data: qrData,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw new Error('Terjadi kesalahan jaringan saat menghubungi server.');
  }
};
