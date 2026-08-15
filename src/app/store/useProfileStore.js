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
       * @param {{ id: string, identifier: string, method: string }} user
       */
      ensureProfile: (user) => {
        if (!user?.id || !get().hasHydrated) return
        if (get().byUserId[user.id]) return
        set((state) => ({
          byUserId: {
            ...state.byUserId,
            [user.id]: createSeedProfile(user),
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
          const current = state.byUserId[userId]
          if (!current) return state
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
