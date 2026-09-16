import { useCallback, useEffect, useState } from 'react'
import { PAGE_SIZE } from '../utils/productFilters'
import {
  API_MAX_PER_PAGE,
  columnsForWidth,
  pageSizeForViewport,
} from '../utils/productGridLayout'

const SM_MQ = '(min-width: 640px)'

/**
 * Measures the listing grid container and returns a viewport-based `per_page`
 * that is always a multiple of the live column count (≤ API max).
 */
export function useViewportPageSize(fallbackPerPage = PAGE_SIZE) {
  const [gridEl, setGridEl] = useState(null)
  const [perPage, setPerPage] = useState(
    () => Math.min(API_MAX_PER_PAGE, fallbackPerPage),
  )
  const [columns, setColumns] = useState(4)

  const gridRef = useCallback((node) => {
    setGridEl(node)
  }, [])

  useEffect(() => {
    if (!gridEl || typeof ResizeObserver === 'undefined') return

    const measure = () => {
      const width = gridEl.getBoundingClientRect().width
      const isSmUp =
        typeof window.matchMedia === 'function'
          ? window.matchMedia(SM_MQ).matches
          : width >= 640
      const cols = columnsForWidth(width, isSmUp)
      const top = gridEl.getBoundingClientRect().top
      // Leave room for pagination + a little padding below the grid.
      const availableHeight = Math.max(320, window.innerHeight - top - 120)
      const next = pageSizeForViewport({
        columns: cols,
        availableHeightPx: availableHeight,
      })
      setColumns(cols)
      setPerPage((prev) => (prev === next ? prev : next))
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(gridEl)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [gridEl])

  return { gridRef, perPage, columns }
}
