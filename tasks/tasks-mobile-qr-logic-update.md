## Relevant Files

- `src/api/attendance.ts` - Contains the API call payload structure that needs to match the backend expectation.
- `src/screens/ScannerScreen.tsx` - Contains the logic that handles scanned QR data and calls the API.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch (e.g., `git checkout -b feature/mobile-qr-logic-sync`)
- [x] 1.0 Update Attendance API Payload
  - [x] 1.1 In `src/api/attendance.ts`, modify `submitAttendance` argument to accept `nisn` (string) instead of the full `qrData`.
  - [x] 1.2 Update the payload inside the `client.post` request to pass `{"nisn": nisn}` instead of `{"qr_code_data": qrData}`.
- [x] 2.0 Update QR Code Parsing Logic in Scanner
  - [x] 2.1 In `src/screens/ScannerScreen.tsx`, locate `handleBarcodeScanned` method.
  - [x] 2.2 Parse the scanned string (e.g., splitting by `|`) to extract `nisn`, `fullName`, and `className`.
  - [x] 2.3 Add validation to ensure the scanned data contains all 3 required parts; if not, show an error alert and return early.
  - [x] 2.4 Pass only the extracted `nisn` to the `submitAttendance` API function.
- [x] 3.0 Enhance Success/Error Dialog Feedback
  - [x] 3.1 In `ScannerScreen.tsx`, upon a successful API response, construct a success message using the extracted `fullName` and `className` (e.g., "Siswa: [Nama] dari kelas [Kelas] telah tercatat.").
  - [x] 3.2 Show this detailed message inside the success `Alert`.
  - [x] 3.3 Ensure any API error message is properly captured and displayed in the error `Alert`.
