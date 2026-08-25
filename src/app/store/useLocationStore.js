import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * @typedef {{
 *   pincode: string,
 *   city: string,
 *   state: string,
 *   label?: string,
 *   addressId?: string | null,
 * }} DeliveryLocation
 */

export const useLocationStore = create(
  persist(
    (set) => ({
      /** @type {DeliveryLocation | null} */
      location: null,

      /**
       * @param {DeliveryLocation} location
       */
      setLocation: (location) => set({ location }),

      clearLocation: () => set({ location: null }),
    }),
    {
      name: 'opel-delivery-location',
      partialize: (state) => ({ location: state.location }),
    },
  ),
)
