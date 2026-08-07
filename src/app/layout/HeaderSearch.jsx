import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'

export default function HeaderSearch() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    navigate(`/products?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full min-w-0 overflow-hidden rounded-md border border-border bg-surface focus-within:border-brand"
      role="search"
    >
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search Product, Category, Brand..."
        className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-muted"
        aria-label="Search products"
      />
      <button
        type="submit"
        className="flex shrink-0 items-center justify-center bg-brand px-4 text-ink-inverse transition hover:bg-brand-dark"
        aria-label="Submit search"
      >
        <FiSearch className="size-5" />
      </button>
    </form>
  )
}
