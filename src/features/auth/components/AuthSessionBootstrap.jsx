import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useAuthStore, toAuthUser } from '../../../app/store/useAuthStore'
import { fetchMe } from '../api/api'
import { authQueryKeys } from '../api/hooks'

/**
 * After persist rehydrate, validate a stored Sanctum token via GET /auth/me.
 * Only clears the session on an explicit 401 — transient /me failures keep the user signed in.
 * Skips a redundant /me when React Query already has fresh me data for the current token
 * (e.g. right after OTP verify).
 */
export default function AuthSessionBootstrap() {
  const hasHydrated = useAuthStore((s) => s.hasHydrated)
  const token = useAuthStore((s) => s.token)
  const setSession = useAuthStore((s) => s.setSession)
  const logout = useAuthStore((s) => s.logout)
  const queryClient = useQueryClient()
  const validatedTokenRef = useRef(/** @type {string | null} */ (null))

  useEffect(() => {
    if (!hasHydrated) return undefined

    const { user } = useAuthStore.getState()
    // Drop pre-API mock sessions that have a user but no Sanctum token.
    if (!token) {
      validatedTokenRef.current = null
      if (user) logout()
      return undefined
    }

    if (validatedTokenRef.current === token) return undefined

    const cached = queryClient.getQueryData(authQueryKeys.me)
    if (
      cached &&
      typeof cached === 'object' &&
      /** @type {{ user?: { id?: unknown } }} */ (cached).user
    ) {
      validatedTokenRef.current = token
      return undefined
    }

    let cancelled = false

    ;(async () => {
      try {
        const data = await fetchMe()
        if (cancelled) return
        const current = useAuthStore.getState().user
        const nextUser = toAuthUser(data.user, current?.method ?? 'otp')
        setSession({
          token,
          user: nextUser,
          profileComplete: Boolean(data.profile_complete ?? data.user?.profile_complete),
        })
        queryClient.setQueryData(authQueryKeys.me, data)
        validatedTokenRef.current = token
      } catch (error) {
        if (cancelled) return
        const status = axios.isAxiosError(error) ? error.response?.status : undefined
        if (status === 401) {
          validatedTokenRef.current = null
          logout()
        }
        // Network / 5xx: keep persisted session; user can continue offline-ish until next check.
      }
    })()

    return () => {
      cancelled = true
    }
  }, [hasHydrated, token, setSession, logout, queryClient])

  return null
}
