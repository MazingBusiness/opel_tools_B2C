import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { FiUser } from 'react-icons/fi'
import { useAuthStore } from '../store/useAuthStore'
import { useUiStore } from '../store/useUiStore'

/** Guard for /profile/* — opens the auth modal and stays on the intended URL. */
export default function RequireAuth() {
  const hasHydrated = useAuthStore((s) => s.hasHydrated)
  const user = useAuthStore((s) => s.user)
  const openAuthModal = useUiStore((s) => s.openAuthModal)

  useEffect(() => {
    if (hasHydrated && !user) openAuthModal()
  }, [hasHydrated, user, openAuthModal])

  // Wait for persist only when we don't already have a session in memory.
  // If `user` is set (fresh login or rehydrate merge) but `hasHydrated` is
  // stuck false, never block the profile outlet behind an empty skeleton.
  if (!hasHydrated && !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto h-40 max-w-md animate-pulse rounded-lg border border-border bg-surface-muted" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto max-w-md rounded-lg border border-dashed border-border bg-surface-muted px-6 py-12 text-center">
          <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
            <FiUser className="size-6" aria-hidden />
          </span>
          <h1 className="text-xl font-extrabold tracking-tight text-ink">
            Sign in to view your account
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Log in with phone or email to open your OPEL dashboard.
          </p>
          <button
            type="button"
            onClick={openAuthModal}
            className="mt-6 rounded-md bg-highlight px-5 py-2.5 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark"
          >
            Login Now
          </button>
        </div>
      </div>
    )
  }

  return <Outlet />
}
