## Relevant Files

### Mobile (React Native / Expo)
- `src/utils/storage.ts` - Fungsi `saveToken`, `getToken`, `deleteToken` menggunakan `expo-secure-store`.
- `src/utils/storage.test.ts` - **[BUAT BARU]** Unit tests untuk `storage.ts`.
- `src/api/client.ts` - Axios client dengan request/response interceptors.
- `src/api/client.test.ts` - **[BUAT BARU]** Unit tests untuk interceptors axios.
- `src/api/auth.ts` - Fungsi API call login/logout.
- `src/api/auth.test.ts` - **[BUAT BARU]** Unit tests untuk fungsi auth API.
- `src/api/attendance.ts` - Fungsi API call absensi.
- `src/api/attendance.test.ts` - **[BUAT BARU]** Unit tests untuk fungsi attendance API.
- `src/screens/LoginScreen.tsx` - Layar login utama.
- `src/screens/LoginScreen.test.tsx` - **[BUAT BARU]** Integration test untuk LoginScreen.
- `src/screens/ScannerScreen.tsx` - Layar QR scanner.
- `src/screens/ScannerScreen.test.tsx` - **[BUAT BARU]** Render/smoke test untuk ScannerScreen.
- `jest.config.js` - **[BUAT BARU]** Konfigurasi Jest untuk Expo.
- `package.json` - Ditambahkan script `test` dan dev dependencies Jest.

### Notes

- Jalankan semua tests: `npx jest` atau setelah setup `bun run test`
- Jalankan satu file: `npx jest src/screens/LoginScreen.test.tsx`
- `expo-secure-store` dan `expo-camera` perlu di-mock karena merupakan native module.
- Gunakan `jest.mock('expo-secure-store')` di setiap file test yang membutuhkannya.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Buat dan checkout branch baru: `git checkout -b test/unit-tests`

- [x] 1.0 Setup testing infrastructure & dependencies
  - [x] 1.1 Install dependencies testing: `bun add --dev jest jest-expo @testing-library/react-native @types/jest`
  - [x] 1.2 Buat file `jest.config.js` di root proyek dengan preset `jest-expo` dan konfigurasi `transformIgnorePatterns` yang benar agar module native Expo bisa dihandle
  - [x] 1.3 Tambahkan script test ke `package.json`: `"test": "jest"` dan `"test:watch": "jest --watch"`
  - [x] 1.4 Buat file `src/setupTests.ts` (atau `jest.setup.ts`) untuk setup global mock (misal: mock `react-native`, `expo-secure-store`)
  - [x] 1.5 Verifikasi setup dengan menjalankan `npx jest --listTests` — harus menampilkan file test tanpa error konfigurasi

- [x] 2.0 Implement utility function unit tests (`src/utils` & `src/api`)
  - [x] 2.1 Buat file `src/utils/storage.test.ts`
  - [x] 2.2 Di awal file, tambahkan `jest.mock('expo-secure-store')` untuk mock native module
  - [x] 2.3 Tulis test `saveToken_callsSetItemAsync`: pastikan `SecureStore.setItemAsync` terpanggil dengan key `'jwt_auth_token'` dan nilai token yang diberikan
  - [x] 2.4 Tulis test `getToken_returnsStoredToken`: mock `getItemAsync` return string token, pastikan fungsi mengembalikan nilai yang sama
  - [x] 2.5 Tulis test `getToken_returnsNullOnError`: mock `getItemAsync` throw error, pastikan fungsi mengembalikan `null` (bukan crash)
  - [x] 2.6 Tulis test `deleteToken_callsDeleteItemAsync`: pastikan `SecureStore.deleteItemAsync` terpanggil dengan key yang benar
  - [x] 2.7 Buat file `src/api/auth.test.ts` dan test fungsi `login` & `logout`
  - [x] 2.8 Buat file `src/api/attendance.test.ts` dan test fungsi absensi
  - [x] 2.9 Buat file `src/api/client.test.ts` dan test axios interceptor

- [x] 3.0 Implement Screen component tests (`src/screens`)
  - [x] 3.1 Buat file `src/screens/LoginScreen.test.tsx`
  - [x] 3.2 Mock modul yang diperlukan: `jest.mock('../api/auth')`, `jest.mock('../utils/storage')`, `jest.mock('@react-navigation/native')`
  - [x] 3.3 Tulis test `renders_usernameAndPasswordInputs`: render `<LoginScreen />` dan pastikan terdapat field input Username dan Password (cari via `getByPlaceholderText` atau `getByTestId`)
  - [x] 3.4 Tulis test `renders_loginButton`: pastikan tombol "Masuk" atau "Login" ter-render di layar
  - [x] 3.5 Tulis test `showsError_whenCredentialsAreEmpty`: submit form tanpa mengisi field, pastikan pesan error atau tombol disabled muncul
  - [x] 3.6 Buat file `src/screens/ScannerScreen.test.tsx`
  - [x] 3.7 Mock `expo-camera`: `jest.mock('expo-camera', () => ({ CameraView: 'CameraView', useCameraPermissions: () => [{ granted: true }, jest.fn()] }))`
  - [x] 3.8 Tulis test `renders_withoutCrashing`: cukup render `<ScannerScreen />` dan pastikan tidak ada error render (smoke test)

- [x] 4.0 Verify test setup & run all tests
  - [x] 4.1 Jalankan `npx jest --verbose` dan pastikan semua test lulus
  - [x] 4.2 Pastikan tidak ada warning "Cannot find module" yang belum ter-handle oleh mock
  - [x] 4.3 Fix test yang gagal jika ada
