import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Client auth session. Persist token + user so the header stays logged-in on refresh.
 *
 * @typedef {{
 *   id: string,
 *   identifier: string,
 *   method: 'otp' | 'google',
 *   name?: string,
 *   email?: string,
 *   phone?: string,
 *   avatar?: string,
 * }} AuthUser
 */

/**
 * Map Laravel UserResource → client AuthUser.
 * @param {import('../../features/auth/api/types.js').AuthApiUser | null | undefined} apiUser
 * @param {'otp' | 'google'} [method]
 * @returns {AuthUser | null}
 */
export function toAuthUser(apiUser, method = 'otp') {
  if (!apiUser) return null
  const email = apiUser.email ? String(apiUser.email) : ''
  const phone = apiUser.phone ? String(apiUser.phone) : ''
  return {
    id: String(apiUser.id),
    identifier: email || phone,
    method,
    name: apiUser.name ? String(apiUser.name) : '',
    email,
    phone,
    avatar: apiUser.avatar ? String(apiUser.avatar) : '',
  }
}

export const useAuthStore = create(
  persist(
    (set) => ({
      /** @type {string | null} */
      token: null,
      /** @type {AuthUser | null} */
      user: null,
      /** @type {boolean} */
      profileComplete: true,
      hasHydrated: false,

      /**
       * @param {{ token: string | null, user: AuthUser | null, profileComplete?: boolean }} session
       */
      setSession: ({ token, user, profileComplete = true }) =>
        set({
          token,
          user,
          profileComplete: Boolean(profileComplete),
          hasHydrated: true,
        }),

      logout: () => set({ token: null, user: null, profileComplete: true }),
    }),
    {
      name: 'opel-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        profileComplete: state.profileComplete,
      }),
      onRehydrateStorage: () => (_state, _error) => {
        // Always mark hydrated — including on storage errors — so the header
        // login control is never stuck behind a non-interactive placeholder.
        useAuthStore.setState({ hasHydrated: true })
      },
    },
  ),
)

function markAuthHydrated() {
  useAuthStore.setState({ hasHydrated: true })
}

if (useAuthStore.persist.hasHydrated()) {
  markAuthHydrated()
} else {
  useAuthStore.persist.onFinishHydration(markAuthHydrated)
}
