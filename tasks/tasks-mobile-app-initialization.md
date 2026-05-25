## Relevant Files

- `App.tsx` - Main entry point configuring the Stack Navigator.
- `src/screens/LoginScreen.tsx` - UI and state logic for teacher authentication.
- `src/screens/ScannerScreen.tsx` - UI and `expo-camera` logic for scanning student QR codes.
- `src/api/client.ts` - Axios instance with JWT auth interceptors.
- `src/api/auth.ts` - API calls related to authentication (POST `/auth/login`).
- `src/api/attendance.ts` - API calls related to submitting attendance data.
- `src/utils/storage.ts` - Wrapper for secure token storage (e.g., using `expo-secure-store`).

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Checkout to a new feature branch (e.g., `git checkout -b feature/init-mobile-app`)

- [x] 1.0 Setup React Native Expo Project
  - [x] 1.1 Initialize project with Bun (e.g., `bunx create-expo-app . -t expo-template-blank-typescript`)
  - [x] 1.2 Install core dependencies: `bun add axios expo-secure-store`
  - [x] 1.3 Install navigation dependencies: `@react-navigation/native @react-navigation/native-stack`
  - [x] 1.4 Install Expo peer dependencies for navigation and camera: `bunx expo install react-native-screens react-native-safe-area-context expo-camera`
  - [x] 1.5 Create project folder structure (`src/screens`, `src/api`, `src/utils`, `src/components`)
  - [x] 1.6 Configure basic Navigation in `App.tsx` (Stack Navigator for Login & Scanner screens)

- [x] 2.0 Implement Authentication (Login UI & Logic)
  - [x] 2.1 Create `src/screens/LoginScreen.tsx` with Username and Password inputs
  - [x] 2.2 Add styling to the Login screen for a clear, readable UI
  - [x] 2.3 Connect Login inputs to React state
  - [x] 2.4 Create `src/utils/storage.ts` using `expo-secure-store` to save/retrieve JWT tokens

- [x] 3.0 Implement QR Code Scanner (Camera UI & Logic)
  - [x] 3.1 Create `src/screens/ScannerScreen.tsx`
  - [x] 3.2 Request Camera permissions on mount using `useCameraPermissions` from `expo-camera`
  - [x] 3.3 Implement `CameraView` to render the camera preview
  - [x] 3.4 Handle `onBarcodeScanned` event to capture and extract the QR string (NISN, Nama, Kelas)
  - [x] 3.5 Prevent continuous rapid scanning by managing a "isScanning" state

- [x] 4.0 API Integration (Login & Submit Attendance)
  - [x] 4.1 Create `src/api/client.ts` Axios instance with base URL and JWT interceptors
  - [x] 4.2 Create `src/api/auth.ts` logic to call the backend login endpoint
  - [x] 4.3 Connect `LoginScreen.tsx` to the auth API: on success, save token to storage and navigate to `ScannerScreen`
  - [x] 4.4 Create `src/api/attendance.ts` to POST attendance data based on scanned QR
  - [x] 4.5 Connect QR scan event in `ScannerScreen.tsx` to attendance submission API
  - [x] 4.6 Handle expected errors (e.g., duplicate scans: "Siswa sudah ter-scan")

- [x] 5.0 UI/UX Polish and Error Handling
  - [x] 5.1 Add Loading indicators (ActivityIndicator) to Login and Scanner screens during API requests
  - [x] 5.2 Implement Alert or Toast notifications for login failure, successful scan, and invalid QR
  - [x] 5.3 Implement auto-resume scan logic (e.g., wait 2 seconds after a successful scan before allowing the next one)
  - [x] 5.4 Add a Logout button in the header of the `ScannerScreen` to clear storage and navigate back to Login
