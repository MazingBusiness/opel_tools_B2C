import { useId, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

/**
 * @param {{
 *   title: string,
 *   id?: string,
 *   activeCount?: number,
 *   defaultOpen?: boolean,
 *   children: import('react').ReactNode,
 * }} props
 */
export default function FilterAccordionSection({
  title,
  id,
  activeCount = 0,
  defaultOpen = false,
  children,
}) {
  const autoId = useId()
  const sectionId = id ?? autoId
  const bodyId = `${sectionId}-body`
  const [open, setOpen] = useState(defaultOpen || activeCount > 0)

  return (
    <section className="border-b border-border pb-3 last:border-b-0">
      <button
        type="button"
        id={sectionId}
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-2 py-1 text-left"
      >
        <span className="text-xs font-bold uppercase tracking-wide text-ink-muted">
          {title}
          {activeCount > 0 ? (
            <span className="ml-1.5 text-brand">({activeCount})</span>
          ) : null}
        </span>
        <FiChevronDown
          className={`size-4 shrink-0 text-ink-muted transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div id={bodyId} role="region" aria-labelledby={sectionId} className="mt-2.5">
          {children}
        </div>
      ) : null}
    </section>
  )
}
