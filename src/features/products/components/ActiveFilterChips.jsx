import { FiX } from 'react-icons/fi'

/**
 * @param {{
 *   filters: Array<{ key: string, label: string, value: string }>,
 *   onRemove: (key: string, value: string) => void,
 *   onClearAll: () => void,
 * }} props
 */
export default function ActiveFilterChips({ filters, onRemove, onClearAll }) {
  if (!filters.length) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <button
          key={`${filter.key}-${filter.value}`}
          type="button"
          onClick={() => onRemove(filter.key, filter.value)}
          className="inline-flex items-center gap-1 rounded-md border border-brand/30 bg-brand/5 px-2.5 py-1 text-xs font-medium text-brand transition hover:bg-brand/10"
        >
          {filter.label}
          <FiX className="size-3.5" aria-hidden />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-semibold text-ink-muted underline-offset-2 hover:text-brand hover:underline"
      >
        Clear all
      </button>
    </div>
  )
}
