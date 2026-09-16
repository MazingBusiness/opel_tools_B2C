/** Shared layout math for the products listing grid (must match CSS). */

export const API_MAX_PER_PAGE = 50

/** Matches `minmax(11.5rem, 1fr)` + `gap-2.5` below `sm`. */
export const GRID_MIN_CARD_PX = 184
export const GRID_GAP_PX = 10

/** Matches `minmax(13rem, 1fr)` + `gap-3` from `sm` up. */
export const GRID_MIN_CARD_SM_PX = 208
export const GRID_GAP_SM_PX = 12

/** Rough ProductCard block height for row estimates (image + title + price + CTAs). */
export const EST_CARD_HEIGHT_PX = 340

/** Tailwind classes kept in sync with the minmax values above. */
export const PRODUCT_GRID_CLASS =
  'grid grid-cols-[repeat(auto-fill,minmax(11.5rem,1fr))] gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] sm:gap-3'

/**
 * @param {number} widthPx
 * @param {boolean} isSmUp
 */
export function columnsForWidth(widthPx, isSmUp) {
  const min = isSmUp ? GRID_MIN_CARD_SM_PX : GRID_MIN_CARD_PX
  const gap = isSmUp ? GRID_GAP_SM_PX : GRID_GAP_PX
  if (!Number.isFinite(widthPx) || widthPx <= 0) return 2
  return Math.max(1, Math.floor((widthPx + gap) / (min + gap)))
}

/**
 * Page size = columns × rows that fit the viewport height, capped at API max,
 * always a multiple of the live column count.
 *
 * @param {{ columns: number, availableHeightPx: number }} args
 */
export function pageSizeForViewport({ columns, availableHeightPx }) {
  const cols = Math.max(1, columns || 1)
  const gap = GRID_GAP_SM_PX
  const height = Number.isFinite(availableHeightPx) ? availableHeightPx : 800
  const rowsFromHeight = Math.max(
    2,
    Math.floor((height + gap) / (EST_CARD_HEIGHT_PX + gap)),
  )
  const maxRows = Math.max(1, Math.floor(API_MAX_PER_PAGE / cols))
  const rows = Math.min(rowsFromHeight, maxRows)
  return cols * rows
}
