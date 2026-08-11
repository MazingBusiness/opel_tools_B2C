import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiArrowLeft, FiSearch, FiX } from 'react-icons/fi'

const PREVIEW_LIMIT = 4
const SEARCH_THRESHOLD = 8

/**
 * @param {Array<{ slug: string }>} items
 * @param {string[]} selected
 * @param {number} [limit]
 */
export function getPreviewItems(items, selected, limit = PREVIEW_LIMIT) {
  const preview = items.slice(0, limit)
  const previewSlugs = new Set(preview.map((item) => item.slug))

  for (const slug of selected) {
    if (!previewSlugs.has(slug)) {
      const item = items.find((entry) => entry.slug === slug)
      if (item) {
        preview.push(item)
        previewSlugs.add(slug)
      }
    }
  }

  return preview
}

/**
 * Desktop: centered modal dialog (industry standard for facet overflow).
 * Mobile drawer: full-height drill-down panel.
 *
 * @param {{
 *   title: string,
 *   items: Array<{ slug: string, label: string, count?: number }>,
 *   selected: string[],
 *   onToggle: (slug: string) => void,
 *   variant?: 'modal' | 'panel',
 *   renderCheckbox: (props: {
 *     slug: string,
 *     label: string,
 *     count?: number,
 *     checked: boolean,
 *     onChange: () => void,
 *   }) => import('react').ReactNode,
 * }} props
 */
export default function FilterOptionsPicker({
  title,
  items,
  selected,
  onToggle,
  variant = 'modal',
  renderCheckbox,
}) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [query, setQuery] = useState('')
  const searchRef = useRef(null)
  const closeRef = useRef(null)
  const listId = useId()
  const titleId = useId()

  const previewItems = getPreviewItems(items, selected)
  const hasOverflow = items.length > PREVIEW_LIMIT

  const filteredItems = query.trim()
    ? items.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()))
    : items

  useEffect(() => {
    if (!pickerOpen) return undefined

    const previousOverflow = document.body.style.overflow

    function handleKeyDown(event) {
      if (event.key === 'Escape') setPickerOpen(false)
    }

    if (variant === 'modal') {
      document.body.style.overflow = 'hidden'
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [pickerOpen, variant])

  useEffect(() => {
    if (!pickerOpen) return
    setQuery('')
    requestAnimationFrame(() => {
      if (items.length >= SEARCH_THRESHOLD) {
        searchRef.current?.focus()
      } else {
        closeRef.current?.focus()
      }
    })
  }, [pickerOpen, items.length])

  function openPicker() {
    setPickerOpen(true)
  }

  function closePicker() {
    setPickerOpen(false)
  }

  const showSearch = items.length >= SEARCH_THRESHOLD

  const optionsList = (
    <ul
      id={listId}
      className={`space-y-2 overflow-y-auto px-4 py-3 ${variant === 'modal' ? 'max-h-[min(24rem,50vh)]' : 'flex-1'}`}
    >
      {filteredItems.length === 0 ? (
        <li className="py-2 text-sm text-ink-muted">No matches found.</li>
      ) : (
        filteredItems.map((item) => (
          <li key={item.slug}>
            {renderCheckbox({
              slug: item.slug,
              label: item.label,
              count: item.count,
              checked: selected.includes(item.slug),
              onChange: () => onToggle(item.slug),
            })}
          </li>
        ))
      )}
    </ul>
  )

  const modalPortal =
    pickerOpen && variant === 'modal'
      ? createPortal(
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Close filter options"
              onClick={closePicker}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative flex w-full max-w-sm flex-col rounded-lg border border-border bg-surface shadow-xl"
            >
              <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
                <div>
                  <h3 id={titleId} className="text-base font-bold text-ink">
                    {title}
                  </h3>
                  <p className="text-xs text-ink-muted">{items.length} options</p>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={closePicker}
                  className="flex size-8 shrink-0 items-center justify-center rounded-md text-ink-muted hover:bg-surface-muted hover:text-ink"
                  aria-label="Close"
                >
                  <FiX className="size-5" />
                </button>
              </div>

              {showSearch ? (
                <div className="relative border-b border-border px-4 py-2">
                  <FiSearch
                    className="pointer-events-none absolute left-7 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
                    aria-hidden
                  />
                  <input
                    ref={searchRef}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={`Search ${title.toLowerCase()}…`}
                    className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm text-ink outline-none focus:border-brand"
                    aria-controls={listId}
                  />
                </div>
              ) : null}

              {optionsList}

              <div className="border-t border-border px-4 py-3">
                <button
                  type="button"
                  onClick={closePicker}
                  className="w-full rounded-md bg-brand py-2.5 text-sm font-bold text-ink-inverse"
                >
                  Done
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null

  const panelPortal =
    pickerOpen && variant === 'panel'
      ? createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-sm flex-col bg-surface shadow-xl lg:hidden"
          >
            <div className="flex items-center gap-2 border-b border-border px-3 py-3">
              <button
                type="button"
                onClick={closePicker}
                className="flex size-8 items-center justify-center rounded-md text-ink-muted hover:bg-surface-muted hover:text-ink"
                aria-label="Back to filters"
              >
                <FiArrowLeft className="size-5" />
              </button>
              <div>
                <h3 id={titleId} className="text-sm font-bold text-ink">
                  {title}
                </h3>
                <p className="text-xs text-ink-muted">{items.length} options</p>
              </div>
            </div>

            {showSearch ? (
              <div className="relative border-b border-border px-4 py-2">
                <FiSearch
                  className="pointer-events-none absolute left-7 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
                  aria-hidden
                />
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={`Search ${title.toLowerCase()}…`}
                  className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm text-ink outline-none focus:border-brand"
                  aria-controls={listId}
                />
              </div>
            ) : null}

            <div className="flex min-h-0 flex-1 flex-col">{optionsList}</div>
          </div>,
          document.body,
        )
      : null

  return (
    <div className="relative">
      <ul className="space-y-2">
        {previewItems.map((item) => (
          <li key={item.slug}>
            {renderCheckbox({
              slug: item.slug,
              label: item.label,
              count: item.count,
              checked: selected.includes(item.slug),
              onChange: () => onToggle(item.slug),
            })}
          </li>
        ))}
      </ul>

      {hasOverflow ? (
        <button
          type="button"
          onClick={openPicker}
          className="mt-2 text-xs font-semibold text-brand hover:underline"
          aria-haspopup="dialog"
        >
          See all ({items.length})
        </button>
      ) : null}

      {modalPortal}
      {panelPortal}
    </div>
  )
}
