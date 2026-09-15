import { useEffect } from 'react'
import { useAuthStore } from '../../../app/store/useAuthStore'
import { useProfileStore } from '../../../app/store/useProfileStore'

/** Auth session + persisted profile for the logged-in user. */
export function useCurrentProfile() {
  const user = useAuthStore((s) => s.user)
  const ensureProfile = useProfileStore((s) => s.ensureProfile)
  const updateProfile = useProfileStore((s) => s.updateProfile)
  const hasHydrated = useProfileStore((s) => s.hasHydrated)
  const profile = useProfileStore((s) => (user ? s.byUserId[user.id] ?? null : null))

  useEffect(() => {
    if (!hasHydrated || !user) return
    ensureProfile(user)

    const local = useProfileStore.getState().byUserId[user.id]
    if (!local) return

    const authName = String(user.name ?? '').trim()
    const localName = String(local.name ?? '').trim()
    const patch = {}

    if (authName && (!localName || localName === 'OPEL Customer')) {
      patch.name = authName
    }
    if (user.email && !local.email) patch.email = user.email
    if (user.phone && !local.phone) patch.phone = user.phone
    if (user.avatar && !local.avatarUrl) patch.avatarUrl = user.avatar

    if (Object.keys(patch).length) {
      updateProfile(user.id, patch)
    }
  }, [hasHydrated, user, ensureProfile, updateProfile])

  return { user, profile }
}
