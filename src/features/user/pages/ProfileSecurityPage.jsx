import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiMonitor, FiSmartphone } from 'react-icons/fi'
import { useProfileStore } from '../../../app/store/useProfileStore'
import { useCurrentProfile } from '../hooks/useCurrentProfile'
import { INPUT_CLASS, LABEL_CLASS } from '../utils/profileHelpers'

const INITIAL_SESSIONS = [
  {
    id: 'this',
    label: 'This device',
    detail: 'Chrome · macOS · Bengaluru',
    current: true,
    icon: FiMonitor,
  },
  {
    id: 's2',
    label: 'Safari on iPhone',
    detail: 'iOS · Mumbai · 2 days ago',
    current: false,
    icon: FiSmartphone,
  },
  {
    id: 's3',
    label: 'Chrome on Android',
    detail: 'Android · Pune · 1 week ago',
    current: false,
    icon: FiSmartphone,
  },
]

export default function ProfileSecurityPage() {
  const { user, profile } = useCurrentProfile()
  const updateProfile = useProfileStore((s) => s.updateProfile)

  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [sessions, setSessions] = useState(INITIAL_SESSIONS)

  const passwordSet = Boolean(profile?.passwordSet)

  function handlePassword(event) {
    event.preventDefault()
    if (!user) return

    if (passwordSet && currentPassword.length < 8) {
      setError('Enter your current password (8+ characters).')
      return
    }
    if (password.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('New password and confirmation do not match.')
      return
    }

    updateProfile(user.id, { passwordSet: true })
    setCurrentPassword('')
    setPassword('')
    setConfirm('')
    setError('')
    toast.success(passwordSet ? 'Password updated' : 'Password saved')
  }

  function signOutOthers() {
    setSessions((prev) => prev.filter((session) => session.current))
    toast.success('Signed out of other sessions')
  }

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-lg border border-border bg-surface p-4 sm:p-5">
        <h2 className="text-xl font-extrabold tracking-tight text-ink">Security</h2>
        <p className="mt-1 text-sm text-ink-muted">
          You sign in with OTP or Google. A password is optional extra protection.
        </p>

        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-border bg-surface-muted px-3 py-2.5">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Login method
            </dt>
            <dd className="mt-1 text-sm font-semibold text-ink">
              {user?.method === 'google' ? 'Google' : 'One-time password (OTP)'}
            </dd>
          </div>
          <div className="rounded-md border border-border bg-surface-muted px-3 py-2.5">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Identifier
            </dt>
            <dd className="mt-1 truncate text-sm font-semibold text-ink">
              {user?.identifier}
            </dd>
          </div>
        </dl>
      </section>

      <form
        onSubmit={handlePassword}
        className="rounded-lg border border-border bg-surface p-4 sm:p-5"
      >
        <h3 className="text-base font-extrabold tracking-tight text-ink">
          {passwordSet ? 'Change password' : 'Set a password'}
        </h3>
        <p className="mt-1 text-sm text-ink-muted">
          {passwordSet
            ? 'Use a unique password of at least 8 characters.'
            : 'Optional. Helps recover the account when a password login API is added.'}
        </p>

        <div className="mt-4 grid max-w-md gap-3">
          {passwordSet ? (
            <label className="block">
              <span className={LABEL_CLASS}>Current password</span>
              <input
                type="password"
                autoComplete="current-password"
                className={INPUT_CLASS}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value)
                  if (error) setError('')
                }}
              />
            </label>
          ) : null}
          <label className="block">
            <span className={LABEL_CLASS}>New password</span>
            <input
              type="password"
              autoComplete="new-password"
              className={INPUT_CLASS}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError('')
              }}
            />
          </label>
          <label className="block">
            <span className={LABEL_CLASS}>Confirm password</span>
            <input
              type="password"
              autoComplete="new-password"
              className={INPUT_CLASS}
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value)
                if (error) setError('')
              }}
            />
          </label>
        </div>

        {error ? (
          <p className="mt-3 text-sm font-medium text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="mt-4 rounded-md bg-highlight px-4 py-2.5 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark"
        >
          {passwordSet ? 'Update password' : 'Save password'}
        </button>
      </form>

      <section className="rounded-lg border border-border bg-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold tracking-tight text-ink">
              Active sessions
            </h3>
            <p className="mt-1 text-sm text-ink-muted">
              Devices currently signed in to this account.
            </p>
          </div>
          {sessions.some((session) => !session.current) ? (
            <button
              type="button"
              onClick={signOutOthers}
              className="rounded-md border-2 border-brand px-3 py-2 text-sm font-bold text-brand transition hover:bg-brand hover:text-ink-inverse"
            >
              Sign out other sessions
            </button>
          ) : null}
        </div>

        <ul className="mt-4 divide-y divide-border">
          {sessions.map((session) => {
            const Icon = session.icon
            return (
              <li key={session.id} className="flex items-center gap-3 py-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">
                    {session.label}
                    {session.current ? (
                      <span className="ml-2 rounded-md bg-success/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-success">
                        Current
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-ink-muted">{session.detail}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
