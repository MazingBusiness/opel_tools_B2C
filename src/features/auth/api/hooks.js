import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchMe, logoutRequest, requestOtp, updateProfile, verifyOtp } from './api'
import { useAuthStore, toAuthUser } from '../../../app/store/useAuthStore'

export const authQueryKeys = {
  me: ['auth', 'me'],
}

/**
 * @param {import('./types.js').AuthTokenResponse} data
 * @param {'otp' | 'google'} method
 */
export function applyAuthSession(data, method = 'otp') {
  const user = toAuthUser(data.user, method)
  useAuthStore.getState().setSession({
    token: data.token,
    user,
    profileComplete: Boolean(data.profile_complete ?? data.user?.profile_complete),
  })
  return user
}

export function useRequestOtpMutation() {
  return useMutation({
    mutationFn: (/** @type {string} */ identifier) => requestOtp(identifier),
  })
}

export function useVerifyOtpMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (/** @type {{ identifier: string, code: string }} */ payload) =>
      verifyOtp(payload),
    onSuccess: (data) => {
      applyAuthSession(data, 'otp')
      queryClient.setQueryData(authQueryKeys.me, data)
    },
  })
}

export function useMeQuery(enabled = true) {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: authQueryKeys.me,
    queryFn: fetchMe,
    enabled: Boolean(enabled && token),
    retry: false,
    staleTime: 60_000,
  })
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      const current = useAuthStore.getState().user
      const user = toAuthUser(data.user, current?.method ?? 'otp')
      useAuthStore.getState().setSession({
        token: useAuthStore.getState().token,
        user,
        profileComplete: Boolean(data.profile_complete ?? data.user?.profile_complete),
      })
      queryClient.setQueryData(authQueryKeys.me, data)
    },
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logoutRequest,
    onSettled: () => {
      queryClient.removeQueries({ queryKey: authQueryKeys.me })
    },
  })
}
