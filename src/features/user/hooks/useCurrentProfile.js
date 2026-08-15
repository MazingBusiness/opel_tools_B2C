import { useEffect } from 'react'
import { useAuthStore } from '../../../app/store/useAuthStore'
import { useProfileStore } from '../../../app/store/useProfileStore'

/** Auth session + persisted profile for the logged-in user. */
export function useCurrentProfile() {
  const user = useAuthStore((s) => s.user)
  const ensureProfile = useProfileStore((s) => s.ensureProfile)
  const hasHydrated = useProfileStore((s) => s.hasHydrated)
  const profile = useProfileStore((s) => (user ? s.byUserId[user.id] ?? null : null))

  useEffect(() => {
    if (hasHydrated && user) ensureProfile(user)
  }, [hasHydrated, user, ensureProfile])

  return { user, profile }
}
