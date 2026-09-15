/** Auth API endpoint paths (relative to VITE_API_BASE_URL). */

export const AUTH_ENDPOINTS = {
  otpRequest: '/api/v1/auth/otp/request',
  otpVerify: '/api/v1/auth/otp/verify',
  /** Wired later — Firebase ID token exchange. */
  google: '/api/v1/auth/google',
  me: '/api/v1/auth/me',
  profile: '/api/v1/auth/profile',
  logout: '/api/v1/auth/logout',
}
