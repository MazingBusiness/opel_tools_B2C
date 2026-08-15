import { Link } from 'react-router-dom'
import {
  FiMapPin,
  FiPackage,
  FiShield,
  FiTruck,
  FiUser,
} from 'react-icons/fi'
import SectionHeading from '../../../shared/components/SectionHeading'
import { useCurrentProfile } from '../hooks/useCurrentProfile'
import { getCompleteness } from '../utils/profileHelpers'
import { mockOrders } from '../data/mockOrders'
import ProfileAvatar from '../components/ProfileAvatar'
import OrderCard from '../components/OrderCard'

export default function ProfileOverviewPage() {
  const { user, profile } = useCurrentProfile()
  const completeness = getCompleteness(profile)
  const inTransit = mockOrders.filter(
    (order) => order.status === 'processing' || order.status === 'shipped',
  ).length
  const recent = mockOrders.slice(0, 3)

  const stats = [
    {
      label: 'Orders',
      value: mockOrders.length,
      hint: 'All time',
      icon: FiPackage,
    },
    {
      label: 'In transit',
      value: inTransit,
      hint: 'Processing & shipped',
      icon: FiTruck,
    },
    {
      label: 'Addresses',
      value: profile?.addresses?.length ?? 0,
      hint: 'Saved locations',
      icon: FiMapPin,
    },
    {
      label: 'Profile',
      value: `${completeness}%`,
      hint: 'Account completeness',
      icon: FiShield,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="h-1.5 w-full bg-brand" aria-hidden />
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
          <ProfileAvatar
            name={profile?.name}
            avatarUrl={profile?.avatarUrl}
            size="lg"
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-extrabold tracking-tight text-ink">
              {profile?.name || 'OPEL Customer'}
            </h2>
            <p className="mt-0.5 truncate text-sm text-ink-muted">
              {user?.identifier}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-md border border-brand/30 bg-brand/5 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-brand">
                {user?.method === 'google' ? 'Google' : 'OTP'}
              </span>
              {profile?.email ? (
                <span className="rounded-md border border-border px-2 py-0.5 text-xs text-ink-muted">
                  {profile.email}
                </span>
              ) : null}
              {profile?.phone ? (
                <span className="rounded-md border border-border px-2 py-0.5 text-xs text-ink-muted">
                  {profile.phone}
                </span>
              ) : null}
            </div>
          </div>
          <Link
            to="/profile/details"
            className="shrink-0 rounded-md border-2 border-brand px-4 py-2 text-sm font-bold text-brand transition hover:bg-brand hover:text-ink-inverse"
          >
            Edit profile
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, hint, icon: Icon }) => (
          <div
            key={label}
            className="rounded-lg border border-border bg-surface p-4"
          >
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {label}
              </p>
              <span className="flex size-8 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Icon className="size-4" aria-hidden />
              </span>
            </div>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-ink">
              {value}
            </p>
            <p className="mt-0.5 text-xs text-ink-muted">{hint}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold text-ink">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            to="/profile/details"
            className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-brand">
              <FiUser className="size-5" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-bold text-ink">Edit profile</span>
              <span className="text-xs text-ink-muted">Name, email, phone</span>
            </span>
          </Link>
          <Link
            to="/profile/addresses"
            className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-brand">
              <FiMapPin className="size-5" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-bold text-ink">Add address</span>
              <span className="text-xs text-ink-muted">Delivery locations</span>
            </span>
          </Link>
          <Link
            to="/profile/orders"
            className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-brand">
              <FiPackage className="size-5" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-bold text-ink">View orders</span>
              <span className="text-xs text-ink-muted">History & tracking</span>
            </span>
          </Link>
        </div>
      </section>

      <section>
        <SectionHeading
          title="Recent orders"
          viewAllHref="/profile/orders"
          viewAllLabel="View all"
        />
        <div className="mt-4 flex flex-col gap-3">
          {recent.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </section>
    </div>
  )
}
