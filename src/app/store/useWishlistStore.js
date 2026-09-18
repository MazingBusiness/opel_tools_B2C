import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { productToWishlistItem } from '../../features/wishlist/data/mockWishlist'

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
      /** Guest mock seed disabled — local empty until user adds, or server hydrate. */
      hasSeeded: true,
      hasHydrated: false,
      /** True after a successful server hydrate while logged in. */
      serverHydrated: false,

      /**
       * @param {string} productId
       */
      hasProduct: (productId) =>
        get().items.some((item) => String(item.productId) === String(productId)),

      /**
       * @param {WishlistItem[]} items
       */
      replaceItems: (items) =>
        set({
          items: Array.isArray(items) ? items : [],
          serverHydrated: true,
          hasSeeded: true,
        }),

      /**
       * @param {object} product
       */
      addItem: (product) => {
        if (!product?.id) return
        set((state) => {
          if (state.items.some((item) => String(item.productId) === String(product.id))) {
            return state
          }
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
              item.id !== lineIdOrProductId &&
              String(item.productId) !== String(lineIdOrProductId),
          ),
        })),

      /**
       * @param {object} product
       * @returns {'added' | 'removed' | 'noop'}
       */
      toggleItem: (product) => {
        if (!product?.id) return 'noop'
        const existing = get().items.find(
          (item) => String(item.productId) === String(product.id),
        )
        if (existing) {
          get().removeItem(existing.id)
          return 'removed'
        }
        get().addItem(product)
        return 'added'
      },

      clear: () =>
        set({
          items: [],
          hasSeeded: true,
          serverHydrated: false,
        }),
    }),
    {
      name: 'opel-wishlist',
      partialize: (state) => ({
        items: state.items,
        hasSeeded: state.hasSeeded,
      }),
      onRehydrateStorage: () => () => {
        useWishlistStore.setState({ hasHydrated: true, hasSeeded: true })
      },
    },
  ),
)

function markWishlistHydrated() {
  useWishlistStore.setState({ hasHydrated: true, hasSeeded: true })
}

if (useWishlistStore.persist.hasHydrated()) {
  markWishlistHydrated()
} else {
  useWishlistStore.persist.onFinishHydration(markWishlistHydrated)
}
