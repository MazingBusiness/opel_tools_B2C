import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { productToCartLine } from '../../features/cart/data/mockCart'
import { MAX_CART_QTY } from '../../features/cart/utils/cartTotals'

/**
 * @typedef {{
 *   id: string,
 *   productId: string,
 *   variantId?: string,
 *   title: string,
 *   imageUrl: string,
 *   href: string,
 *   unitPrice: number,
 *   originalPrice: number,
 *   discountPercentage: number,
 *   qty: number,
 *   available?: boolean,
 *   inStock?: boolean,
 *   minQty?: number,
 *   maxQty?: number,
 * }} CartLine
 */

export const useCartStore = create(
  persist(
    (set) => ({
      /** @type {CartLine[]} */
      items: [],
      hasSeeded: true,
      hasHydrated: false,
      serverHydrated: false,
      /** @type {{ itemCount: number, lineCount: number, subtotal: number, savings: number } | null} */
      serverMeta: null,

      /**
       * @param {CartLine[]} items
       * @param {object} [meta]
       */
      replaceItems: (items, meta = null) =>
        set({
          items: Array.isArray(items) ? items : [],
          serverMeta: meta,
          serverHydrated: true,
          hasSeeded: true,
        }),

      /**
       * Optimistic local add (logged-in only — guests never persist cart).
       * @param {object} product
       * @param {number} [qty]
       */
      addItem: (product, qty = 1) => {
        if (!product?.id) return
        const addQty = Math.min(MAX_CART_QTY, Math.max(1, qty))
        set((state) => {
          const existing = state.items.find(
            (item) => String(item.productId) === String(product.id),
          )
          if (existing) {
            return {
              items: state.items.map((item) =>
                String(item.productId) === String(product.id)
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
            .map((item) => {
              if (item.id !== lineId) return item
              const nextQty = Math.min(MAX_CART_QTY, Math.max(1, qty))
              return {
                ...item,
                qty: nextQty,
                effectiveQty: nextQty,
                lineTotal: item.unitPrice * nextQty,
                qtyExceedsStock: false,
              }
            })
            .filter((item) => item.qty > 0),
        })),

      /**
       * @param {string} lineId
       */
      removeItem: (lineId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== lineId),
        })),

      clear: () =>
        set({
          items: [],
          hasSeeded: true,
          serverHydrated: false,
          serverMeta: null,
        }),
    }),
    {
      name: 'opel-cart',
      // No guest cart lines — keep itemCount so the header badge survives refresh.
      partialize: (state) => ({
        hasSeeded: true,
        serverMeta: state.serverMeta
          ? {
              itemCount: Number(state.serverMeta.itemCount ?? 0),
              lineCount: Number(state.serverMeta.lineCount ?? 0),
              subtotal: 0,
              savings: 0,
            }
          : null,
      }),
      // Do not call useCartStore here: hydrate runs during create() (TDZ) and a
      // throw aborts zustand persist before persist.hasHydrated() becomes true.
      onRehydrateStorage: () => {},
    },
  ),
)

function markCartHydrated() {
  useCartStore.setState({ hasHydrated: true, hasSeeded: true })
}

if (useCartStore.persist.hasHydrated()) {
  markCartHydrated()
} else {
  useCartStore.persist.onFinishHydration(markCartHydrated)
}
