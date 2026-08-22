import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  createSeedWishlistItems,
  productToWishlistItem,
} from '../../features/wishlist/data/mockWishlist'

/**
 * @typedef {{
 *   id: string,
 *   productId: string,
 *   title: string,
 *   imageUrl: string,
 *   href: string,
 *   unitPrice: number,
 *   originalPrice: number,
 *   discountPercentage: number,
 *   inStock?: boolean,
 * }} WishlistItem
 */

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      /** @type {WishlistItem[]} */
      items: [],
      hasSeeded: false,
      hasHydrated: false,

      /**
       * @param {string} productId
       */
      hasProduct: (productId) => get().items.some((item) => item.productId === productId),

      /**
       * @param {object} product
       */
      addItem: (product) => {
        if (!product?.id) return
        set((state) => {
          if (state.items.some((item) => item.productId === product.id)) return state
          const line = productToWishlistItem(product)
          if (!line) return state
          return { items: [...state.items, line] }
        })
      },

      /**
       * @param {string} lineIdOrProductId
       */
      removeItem: (lineIdOrProductId) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              item.id !== lineIdOrProductId && item.productId !== lineIdOrProductId,
          ),
        })),

      /**
       * @param {object} product
       * @returns {'added' | 'removed' | 'noop'}
       */
      toggleItem: (product) => {
        if (!product?.id) return 'noop'
        const existing = get().items.find((item) => item.productId === product.id)
        if (existing) {
          get().removeItem(existing.id)
          return 'removed'
        }
        get().addItem(product)
        return 'added'
      },

      clear: () => set({ items: [], hasSeeded: true }),
    }),
    {
      name: 'opel-wishlist',
      partialize: (state) => ({ items: state.items, hasSeeded: state.hasSeeded }),
      onRehydrateStorage: () => () => {
        seedIfNeeded()
      },
    },
  ),
)

function seedIfNeeded() {
  const current = useWishlistStore.getState()
  if (!current.hasSeeded && current.items.length === 0) {
    useWishlistStore.setState({
      items: createSeedWishlistItems(),
      hasSeeded: true,
      hasHydrated: true,
    })
    return
  }
  useWishlistStore.setState({
    hasHydrated: true,
    hasSeeded: true,
  })
}

if (useWishlistStore.persist.hasHydrated()) {
  seedIfNeeded()
}
