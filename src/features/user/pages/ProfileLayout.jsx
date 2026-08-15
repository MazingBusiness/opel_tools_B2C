import { Outlet, useLocation, useMatch } from 'react-router-dom'
import Breadcrumb from '../../../shared/components/Breadcrumb'
import { useCurrentProfile } from '../hooks/useCurrentProfile'
import { getProfileSectionLabel } from '../data/profileNav'
import ProfileSidebar from '../components/ProfileSidebar'
import ProfileMobileNav from '../components/ProfileMobileNav'

export default function ProfileLayout() {
  const { profile } = useCurrentProfile()
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
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          My Account
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {profile?.name
            ? `Welcome back, ${profile.name}.`
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
