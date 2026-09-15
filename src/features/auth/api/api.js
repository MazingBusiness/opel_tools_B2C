import { apiClient } from '../../../shared/api/client'
import { useAuthStore } from '../../../app/store/useAuthStore'
import { queryClient } from '../../../app/query/queryClient'
import { AUTH_ENDPOINTS } from './endpoints'

/** Keep in sync with authQueryKeys.me in hooks.js (avoid circular import). */
const AUTH_ME_QUERY_KEY = ['auth', 'me']

/**
 * @param {string} identifier
 * @returns {Promise<import('./types.js').OtpRequestResponse>}
 */
export async function requestOtp(identifier) {
  const { data } = await apiClient.post(AUTH_ENDPOINTS.otpRequest, { identifier })
  return data
}

/**
 * @param {{ identifier: string, code: string }} payload
 * @returns {Promise<import('./types.js').AuthTokenResponse>}
 */
export async function verifyOtp(payload) {
  const { data } = await apiClient.post(AUTH_ENDPOINTS.otpVerify, payload)
  return data
}

/**
 * @returns {Promise<import('./types.js').AuthMeResponse>}
 */
export async function fetchMe() {
  const { data } = await apiClient.get(AUTH_ENDPOINTS.me)
  return data
}

/**
 * @param {{ name?: string | null, email?: string | null, phone?: string | null, avatar?: string | null }} payload
 * @returns {Promise<import('./types.js').AuthMeResponse>}
 */
export async function updateProfile(payload) {
  const { data } = await apiClient.patch(AUTH_ENDPOINTS.profile, payload)
  return data
}

/** Best-effort server logout, then always clear the local session + auth/me cache. */
export async function logoutRequest() {
  const token = useAuthStore.getState().token
  try {
    if (token) {
      await apiClient.post(AUTH_ENDPOINTS.logout)
    }
  } catch {
    // Network / already-invalid token — still clear locally.
  } finally {
    useAuthStore.getState().logout()
    queryClient.removeQueries({ queryKey: AUTH_ME_QUERY_KEY })
  }
}
