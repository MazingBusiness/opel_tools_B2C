import { Link } from 'react-router-dom'

export default function TopBar() {
  return (
    <div className="bg-secondary text-ink-inverse">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-sm">
        <p className="min-w-0 truncate">
          <span className="font-semibold text-brand-light">OPEL Tools</span>
          <span className="mx-2 hidden text-ink-muted sm:inline">|</span>
          <span className="hidden sm:inline">
            Industrial power tools built for performance.
          </span>
        </p>
        <Link
          to="/"
          className="shrink-0 rounded-md bg-highlight px-3 py-1.5 text-xs font-semibold text-cta-foreground transition hover:bg-highlight-dark"
        >
          Explore OPEL Tools
        </Link>
      </div>
    </div>
  )
}
