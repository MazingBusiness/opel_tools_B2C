import { NavLink, useNavigate } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../../app/store/useAuthStore'
import { PROFILE_NAV } from '../data/profileNav'

export default function ProfileSidebar() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    toast.success('Logged out')
    navigate('/')
  }

  return (
    <aside
      className="hidden shrink-0 lg:block lg:w-[260px]"
      aria-label="Account navigation"
    >
      <nav className="sticky top-[calc(var(--header-offset,120px)+1rem)] rounded-lg border border-border bg-surface p-2">
        <p className="px-3 pb-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          My Account
        </p>
        <ul className="flex flex-col gap-0.5">
          {PROFILE_NAV.map(({ to, label, end, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm transition ${
                    isActive
                      ? 'bg-brand/10 font-semibold text-brand'
                      : 'text-ink hover:bg-surface-muted'
                  }`
                }
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="mt-2 border-t border-border pt-2">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm text-ink transition hover:bg-surface-muted"
          >
            <FiLogOut className="size-4 shrink-0" aria-hidden />
            Logout
          </button>
        </div>
      </nav>
    </aside>
  )
}
