import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { categoryNavItems } from './categoryNavData'
import CategoryMegaMenu from './CategoryMegaMenu'

const CLOSE_DELAY_MS = 140

function categoryHref(item) {
  return item.slug === 'power-tools'
    ? '/category/power-tools'
    : `/products?category=${encodeURIComponent(item.slug)}`
}

function isRouteActive(pathname, search, item) {
  if (pathname.startsWith(`/category/${item.slug}`)) return true
  if (pathname === '/products') {
    const params = new URLSearchParams(search)
    return params.get('category') === item.slug
  }
  return false
}

export default function CategoryNav() {
  const { pathname, search } = useLocation()
  const [activeId, setActiveId] = useState(null)
  const closeTimerRef = useRef(null)
  const rootRef = useRef(null)
  const menuId = useId()

  const activeCategory =
    categoryNavItems.find((item) => item.id === activeId) ?? null

  function clearCloseTimer() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  function openCategory(id) {
    clearCloseTimer()
    setActiveId(id)
  }

  function scheduleClose() {
    clearCloseTimer()
    closeTimerRef.current = setTimeout(() => {
      setActiveId(null)
    }, CLOSE_DELAY_MS)
  }

  function toggleCategory(id) {
    clearCloseTimer()
    setActiveId((current) => (current === id ? null : id))
  }

  useEffect(() => {
    function handlePointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setActiveId(null)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setActiveId(null)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      clearCloseTimer()
    }
  }, [])

  return (
    <nav
      ref={rootRef}
      className="relative border-b border-border bg-surface-muted"
      aria-label="Product categories"
      onMouseLeave={scheduleClose}
    >
      <div className="mx-auto max-w-7xl">
        <ul className="flex justify-between gap-1 overflow-x-auto px-2 sm:px-4">
          {categoryNavItems.map((item) => {
            const Icon = item.icon
            const isHovered = activeId === item.id
            const isCurrent = isRouteActive(pathname, search, item)

            return (
              <li key={item.id} className="shrink-0">
                <div
                  className="h-full"
                  onMouseEnter={() => openCategory(item.id)}
                >
                  <Link
                    to={categoryHref(item)}
                    onClick={(event) => {
                      if (window.matchMedia('(hover: none)').matches) {
                        event.preventDefault()
                        toggleCategory(item.id)
                      }
                    }}
                    className={[
                      'flex min-w-[4.75rem] flex-col items-center gap-1 border-b-[3px] px-2 py-2.5 text-center transition sm:min-w-[5.5rem]',
                      isHovered || isCurrent
                        ? 'border-brand font-semibold text-brand'
                        : 'border-transparent text-ink hover:border-brand/40 hover:text-brand',
                    ].join(' ')}
                    aria-expanded={isHovered}
                    aria-controls={isHovered ? menuId : undefined}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    <Icon className="size-5 shrink-0" aria-hidden />
                    <span className="text-[11px] leading-tight sm:text-xs">
                      {item.label}
                    </span>
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {activeCategory ? (
        <div id={menuId} onMouseEnter={() => openCategory(activeCategory.id)}>
          <CategoryMegaMenu category={activeCategory} />
        </div>
      ) : null}
    </nav>
  )
}
