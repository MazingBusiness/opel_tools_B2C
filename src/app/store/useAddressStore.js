import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
 * }} Address
 */

export const useAddressStore = create(
  persist(
    (set, get) => ({
      /** @type {Address[]} */
      items: [],
      hasHydrated: false,
      serverHydrated: false,

      /**
       * @param {Address[]} items
       */
      replaceItems: (items) =>
        set({
          items: Array.isArray(items) ? items : [],
          serverHydrated: true,
        }),

      clear: () =>
        set({
          items: [],
          serverHydrated: false,
        }),
    }),
    {
      name: 'opel-addresses',
      // No guest addresses — badge/list come from API hydrate.
      partialize: () => ({}),
      onRehydrateStorage: () => () => {
        useAddressStore.setState({ hasHydrated: true })
      },
    },
  ),
)

function markAddressHydrated() {
  useAddressStore.setState({ hasHydrated: true })
}

if (useAddressStore.persist.hasHydrated()) {
  markAddressHydrated()
} else {
  useAddressStore.persist.onFinishHydration(markAddressHydrated)
}
