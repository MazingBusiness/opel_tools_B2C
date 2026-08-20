import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createSeedCartLines, productToCartLine } from '../../features/cart/data/mockCart'
import { MAX_CART_QTY } from '../../features/cart/utils/cartTotals'

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
 *   qty: number,
 * }} CartLine
 */

export const useCartStore = create(
  persist(
    (set) => ({
      /** @type {CartLine[]} */
      items: [],
      hasSeeded: false,
      hasHydrated: false,

      /**
       * @param {object} product
       * @param {number} [qty]
       */
      addItem: (product, qty = 1) => {
        if (!product?.id) return
        const addQty = Math.min(MAX_CART_QTY, Math.max(1, qty))
        set((state) => {
          const existing = state.items.find((item) => item.productId === product.id)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id
                  ? { ...item, qty: Math.min(MAX_CART_QTY, item.qty + addQty) }
                  : item,
              ),
            }
          }
          const line = productToCartLine(product, addQty)
          if (!line) return state
          return { items: [...state.items, line] }
        })
      },

      /**
       * @param {string} lineId
       * @param {number} qty
       */
      setQty: (lineId, qty) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === lineId
                ? { ...item, qty: Math.min(MAX_CART_QTY, Math.max(1, qty)) }
                : item,
            )
            .filter((item) => item.qty > 0),
        })),

      /**
       * @param {string} lineId
       */
      removeItem: (lineId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== lineId),
        })),

      clear: () => set({ items: [], hasSeeded: true }),
    }),
    {
      name: 'opel-cart',
      partialize: (state) => ({ items: state.items, hasSeeded: state.hasSeeded }),
      onRehydrateStorage: () => () => {
        seedIfNeeded()
      },
    },
  ),
)

function seedIfNeeded() {
  const current = useCartStore.getState()
  if (!current.hasSeeded && current.items.length === 0) {
    useCartStore.setState({
      items: createSeedCartLines(),
      hasSeeded: true,
      hasHydrated: true,
    })
    return
  }
  useCartStore.setState({
    hasHydrated: true,
    hasSeeded: true,
  })
}

if (useCartStore.persist.hasHydrated()) {
  seedIfNeeded()
}
