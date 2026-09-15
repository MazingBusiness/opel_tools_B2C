import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  createSeedProfile,
  newAddressId,
} from '../../features/user/utils/profileHelpers'

/**
 * @typedef {{
 *   id: string,
 *   name: string,
 *   phone: string,
 *   line1: string,
 *   line2: string,
 *   city: string,
 *   state: string,
 *   pincode: string,
 *   type: 'home' | 'work',
 *   isDefault: boolean,
 * }} ProfileAddress
 *
 * @typedef {{
 *   name: string,
 *   email: string,
 *   phone: string,
 *   avatarUrl: string,
 *   passwordSet: boolean,
 *   addresses: ProfileAddress[],
 * }} UserProfile
 */

export const useProfileStore = create(
  persist(
    (set, get) => ({
      /** @type {Record<string, UserProfile>} */
      byUserId: {},
      hasHydrated: false,

      /**
       * Seed a profile if missing; fill blank contact fields from the auth user.
       * @param {{ id: string, identifier: string, method: string, name?: string, email?: string, phone?: string, avatar?: string }} user
       */
      ensureProfile: (user) => {
        if (!user?.id || !get().hasHydrated) return
        const existing = get().byUserId[user.id]
        const seed = createSeedProfile(user)

        if (!existing) {
          set((state) => ({
            byUserId: {
              ...state.byUserId,
              [user.id]: seed,
            },
          }))
          return
        }

        /** Prefer non-empty API / seed values for blank local fields. */
        const next = {
          ...existing,
          email: existing.email || seed.email || '',
          phone: existing.phone || seed.phone || '',
          avatarUrl: existing.avatarUrl || seed.avatarUrl || '',
          name:
            existing.name && existing.name !== 'OPEL Customer'
              ? existing.name
              : seed.name || existing.name,
        }

        if (
          next.email === existing.email &&
          next.phone === existing.phone &&
          next.avatarUrl === existing.avatarUrl &&
          next.name === existing.name
        ) {
          return
        }

        set((state) => ({
          byUserId: {
            ...state.byUserId,
            [user.id]: next,
          },
        }))
      },

      /**
       * @param {string} userId
       * @param {Partial<UserProfile>} patch
       */
      updateProfile: (userId, patch) =>
        set((state) => {
          const current = state.byUserId[userId]
          if (!current) return state
          return {
            byUserId: {
              ...state.byUserId,
              [userId]: { ...current, ...patch },
            },
          }
        }),

      /**
       * @param {string} userId
       * @param {Omit<ProfileAddress, 'id'>} address
       */
      addAddress: (userId, address) =>
        set((state) => {
          let current = state.byUserId[userId]
          if (!current) {
            current = {
              name: address.name || 'OPEL Customer',
              email: '',
              phone: address.phone || '',
              avatarUrl: '',
              passwordSet: false,
              addresses: [],
            }
          }
          const next = {
            ...address,
            id: newAddressId(),
          }
          let addresses = [...current.addresses, next]
          if (next.isDefault || addresses.length === 1) {
            addresses = addresses.map((item) => ({
              ...item,
              isDefault: item.id === next.id,
            }))
          }
          return {
            byUserId: {
              ...state.byUserId,
              [userId]: { ...current, addresses },
            },
          }
        }),

      /**
       * @param {string} userId
       * @param {string} addressId
       * @param {Partial<ProfileAddress>} patch
       */
      updateAddress: (userId, addressId, patch) =>
        set((state) => {
          const current = state.byUserId[userId]
          if (!current) return state
          let addresses = current.addresses.map((item) =>
            item.id === addressId ? { ...item, ...patch, id: item.id } : item,
          )
          const updated = addresses.find((item) => item.id === addressId)
          if (updated?.isDefault) {
            addresses = addresses.map((item) => ({
              ...item,
              isDefault: item.id === addressId,
            }))
          }
          return {
            byUserId: {
              ...state.byUserId,
              [userId]: { ...current, addresses },
            },
          }
        }),

      /**
       * @param {string} userId
       * @param {string} addressId
       */
      deleteAddress: (userId, addressId) =>
        set((state) => {
          const current = state.byUserId[userId]
          if (!current) return state
          let addresses = current.addresses.filter((item) => item.id !== addressId)
          if (addresses.length && !addresses.some((item) => item.isDefault)) {
            addresses = addresses.map((item, index) => ({
              ...item,
              isDefault: index === 0,
            }))
          }
          return {
            byUserId: {
              ...state.byUserId,
              [userId]: { ...current, addresses },
            },
          }
        }),

      /**
       * @param {string} userId
       * @param {string} addressId
       */
      setDefaultAddress: (userId, addressId) =>
        set((state) => {
          const current = state.byUserId[userId]
          if (!current) return state
          return {
            byUserId: {
              ...state.byUserId,
              [userId]: {
                ...current,
                addresses: current.addresses.map((item) => ({
                  ...item,
                  isDefault: item.id === addressId,
                })),
              },
            },
          }
        }),
    }),
    {
      name: 'opel-profile',
      partialize: (state) => ({ byUserId: state.byUserId }),
      onRehydrateStorage: () => () => {
        useProfileStore.setState({ hasHydrated: true })
      },
    },
  ),
)

if (useProfileStore.persist.hasHydrated()) {
  useProfileStore.setState({ hasHydrated: true })
}
