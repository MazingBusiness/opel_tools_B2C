import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockOrders } from '../../features/user/data/mockOrders'

/**
 * @typedef {import('../../features/user/data/mockOrders.js').mockOrders[number]} Order
 */

export const useOrdersStore = create(
  persist(
    (set, get) => ({
      /** @type {Record<string, Order[]>} */
      byUserId: {},
      hasSeeded: false,
      hasHydrated: false,

      /**
       * @param {string} userId
       */
      ensureSeeded: (userId) => {
        if (!userId || get().byUserId[userId]) return
        set((state) => ({
          byUserId: {
            ...state.byUserId,
            [userId]: [...mockOrders],
          },
          hasSeeded: true,
        }))
      },

      /**
       * @param {string} userId
       * @returns {Order[]}
       */
      getOrders: (userId) => {
        if (!userId) return []
        return get().byUserId[userId] ?? []
      },

      /**
       * @param {string} userId
       * @param {string} orderId
       * @returns {Order | null}
       */
      getOrderById: (userId, orderId) => {
        const orders = get().byUserId[userId] ?? []
        return orders.find((order) => order.id === orderId) ?? null
      },

      /**
       * Public lookup: scans all users' orders, then mock seed data.
       * @param {string} orderId
       * @returns {Order | null}
       */
      findOrderById: (orderId) => {
        const normalized = orderId?.trim()
        if (!normalized) return null
        const lower = normalized.toLowerCase()
        for (const orders of Object.values(get().byUserId)) {
          const match = orders.find((order) => order.id.toLowerCase() === lower)
          if (match) return match
        }
        return mockOrders.find((order) => order.id.toLowerCase() === lower) ?? null
      },

      /**
       * @param {string} userId
       * @param {Order} order
       */
      addOrder: (userId, order) => {
        if (!userId) return
        get().ensureSeeded(userId)
        set((state) => ({
          byUserId: {
            ...state.byUserId,
            [userId]: [order, ...(state.byUserId[userId] ?? [])],
          },
        }))
      },
    }),
    {
      name: 'opel-orders',
      partialize: (state) => ({ byUserId: state.byUserId, hasSeeded: state.hasSeeded }),
      onRehydrateStorage: () => () => {
        useOrdersStore.setState({ hasHydrated: true })
      },
    },
  ),
)

if (useOrdersStore.persist.hasHydrated()) {
  useOrdersStore.setState({ hasHydrated: true })
}
