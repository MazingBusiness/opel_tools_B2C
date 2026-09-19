import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useAuthStore, toAuthUser } from '../../../app/store/useAuthStore'
import { fetchMe } from '../api/api'
import { authQueryKeys } from '../api/hooks'
import { hydrateWishlistFromServer, clearWishlistLocal } from '../../wishlist/api/hydrate'
import { hydrateCartFromServer, clearCartLocal } from '../../cart/api/hydrate'
import { hydrateAddressesFromServer, clearAddressesLocal } from '../../address/api/hydrate'
import { useCartStore } from '../../../app/store/useCartStore'
import { useAddressStore } from '../../../app/store/useAddressStore'

/**
 * After persist rehydrate, validate a stored Sanctum token via GET /auth/me.
 * Cart + address hydrate are separate from the me-once ref so a failed hydrate can retry.
 */
export default function AuthSessionBootstrap() {
  const hasHydrated = useAuthStore((s) => s.hasHydrated)
  const cartServerHydrated = useCartStore((s) => s.serverHydrated)
  const addressServerHydrated = useAddressStore((s) => s.serverHydrated)
  const token = useAuthStore((s) => s.token)
  const setSession = useAuthStore((s) => s.setSession)
  const logout = useAuthStore((s) => s.logout)
  const queryClient = useQueryClient()
  const validatedTokenRef = useRef(/** @type {string | null} */ (null))

  useEffect(() => {
    if (!hasHydrated) return undefined

    const { user } = useAuthStore.getState()
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
      void hydrateWishlistFromServer()
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
        void hydrateWishlistFromServer()
      } catch (error) {
        if (cancelled) return
        const status = axios.isAxiosError(error) ? error.response?.status : undefined
        if (status === 401) {
          validatedTokenRef.current = null
          logout()
          clearWishlistLocal()
          clearCartLocal()
          clearAddressesLocal()
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [hasHydrated, token, setSession, logout, queryClient])

  useEffect(() => {
    if (!token || cartServerHydrated) return undefined
    void hydrateCartFromServer()
    return undefined
  }, [token, cartServerHydrated])

  useEffect(() => {
    if (!token || addressServerHydrated) return undefined
    void hydrateAddressesFromServer()
    return undefined
  }, [token, addressServerHydrated])

  return null
}
