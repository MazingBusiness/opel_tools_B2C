import { NavLink } from 'react-router-dom'
import { PROFILE_NAV } from '../data/profileNav'

export default function ProfileMobileNav() {
  return (
    <nav
      className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden"
      aria-label="Account sections"
    >
      {PROFILE_NAV.map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `shrink-0 rounded-md border px-3 py-1.5 text-sm font-semibold transition ${
              isActive
                ? 'border-brand bg-brand/10 text-brand'
                : 'border-border bg-surface text-ink hover:border-brand/40'
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
