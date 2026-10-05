import { Outlet, useLocation, useMatch } from 'react-router-dom'
import Breadcrumb from '../../../shared/components/Breadcrumb'
import { useCurrentProfile } from '../hooks/useCurrentProfile'
import { resolveDisplayName } from '../utils/profileHelpers'
import { getProfileSectionLabel } from '../data/profileNav'
import ProfileSidebar from '../components/ProfileSidebar'
import ProfileMobileNav from '../components/ProfileMobileNav'

export default function ProfileLayout() {
  const { user, profile } = useCurrentProfile()
  const displayName = resolveDisplayName(user, profile)
  const { pathname } = useLocation()
  const orderMatch = useMatch('/profile/orders/:orderId')
  const orderId = orderMatch?.params.orderId
  const sectionLabel = getProfileSectionLabel(pathname)

  const crumbs = [{ label: 'Home', href: '/' }, { label: 'My Account', href: '/profile' }]
  if (orderId) {
    crumbs.push({ label: 'My orders', href: '/profile/orders' })
    crumbs.push({ label: orderId })
  } else if (sectionLabel !== 'Overview') {
    crumbs.push({ label: sectionLabel })
  }

  return (
    <div className="mx-auto max-w-7xl pb-10">
      <Breadcrumb items={crumbs} />

      <div className="px-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          My Account
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          {displayName
            ? `Welcome back, ${displayName}.`
            : 'Manage your profile, orders, and security.'}
        </p>

        <ProfileMobileNav />

        <div className="mt-6 flex items-start gap-6">
          <ProfileSidebar />
          <div className="min-w-0 flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
