import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Client auth session (mock until API). Persist so header stays logged-in on refresh.
 * @typedef {{ id: string, identifier: string, method: 'otp' | 'google' }} AuthUser
 */

export const useAuthStore = create(
  persist(
    (set) => ({
      /** @type {AuthUser | null} */
      user: null,
      /** @param {AuthUser} user */
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'opel-auth',
      partialize: (state) => ({ user: state.user }),
    },
  ),
)
