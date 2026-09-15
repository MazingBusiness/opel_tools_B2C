import { useEffect, useId, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useProfileStore } from '../../../app/store/useProfileStore'
import { getErrorMessage } from '../../../shared/api/client'
import { parseIdentifier } from '../../auth/utils/identifier'
import { useMeQuery, useUpdateProfileMutation } from '../../auth/api/hooks'
import { useCurrentProfile } from '../hooks/useCurrentProfile'
import { INPUT_CLASS, LABEL_CLASS } from '../utils/profileHelpers'
import ProfileAvatar from '../components/ProfileAvatar'

export default function ProfileDetailsPage() {
  const { user, profile } = useCurrentProfile()
  const updateLocalProfile = useProfileStore((s) => s.updateProfile)
  const ensureProfile = useProfileStore((s) => s.ensureProfile)
  const meQuery = useMeQuery(Boolean(user))
  const updateMutation = useUpdateProfileMutation()
  const formId = useId()
  const dirtyRef = useRef(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const apiUser = meQuery.data?.user
  const busy = updateMutation.isPending
  const loadingMe = meQuery.isLoading
  const fieldsDisabled = busy || loadingMe

  useEffect(() => {
    if (!user && !profile && !apiUser) return
    // Don't clobber in-progress edits when /me resolves late.
    if (dirtyRef.current) return

    setName((apiUser?.name ?? profile?.name ?? user?.name ?? '').toString())
    setEmail((apiUser?.email ?? profile?.email ?? user?.email ?? '').toString())
    setPhone((apiUser?.phone ?? profile?.phone ?? user?.phone ?? '').toString())
  }, [apiUser, profile, user])

  /**
   * @param {(value: string) => void} setter
   */
  function onFieldChange(setter) {
    return (event) => {
      dirtyRef.current = true
      setter(event.target.value)
      if (error) setError('')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!user || busy || loadingMe) return

    const trimmedName = name.trim()
    if (trimmedName.length < 2) {
      setError('Enter your full name.')
      return
    }

    let nextEmail = email.trim().toLowerCase()
    let nextPhone = phone.trim()

    if (nextEmail) {
      const parsed = parseIdentifier(nextEmail)
      if (!parsed.ok || parsed.kind !== 'email') {
        setError('Enter a valid email address.')
        return
      }
      nextEmail = parsed.identifier
    }

    if (nextPhone) {
      const parsed = parseIdentifier(nextPhone)
      if (!parsed.ok || parsed.kind !== 'phone') {
        setError(
          parsed.ok === false
            ? parsed.error
            : 'Enter a valid 10-digit Indian mobile number.',
        )
        return
      }
      nextPhone = parsed.identifier
    }

    if (!nextEmail && !nextPhone) {
      setError('Add at least an email or phone number.')
      return
    }

    setError('')
    try {
      // Omit avatar until upload exists — sending null would clear a stored photo.
      const data = await updateMutation.mutateAsync({
        name: trimmedName,
        email: nextEmail || null,
        phone: nextPhone || null,
      })

      const nextUser = data.user
      ensureProfile(user)
      updateLocalProfile(user.id, {
        name: nextUser?.name ? String(nextUser.name) : trimmedName,
        email: nextUser?.email ? String(nextUser.email) : nextEmail,
        phone: nextUser?.phone ? String(nextUser.phone) : nextPhone,
        avatarUrl: nextUser?.avatar ? String(nextUser.avatar) : '',
      })

      dirtyRef.current = false
      if (nextUser?.phone) setPhone(String(nextUser.phone))
      toast.success('Profile updated')
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update profile. Please try again.'))
    }
  }

  const avatarUrl =
    (apiUser?.avatar && String(apiUser.avatar)) ||
    profile?.avatarUrl ||
    user?.avatar ||
    ''

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-surface p-4 sm:p-5"
    >
      <h2 className="text-xl font-extrabold tracking-tight text-ink">
        Profile details
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        Update how we address you on orders and delivery.
      </p>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
        <ProfileAvatar name={name} avatarUrl={avatarUrl} size="lg" />
        <div>
          <p className="text-sm font-semibold text-ink">Photo</p>
          <p className="mt-1 text-xs text-ink-muted">
            Avatar upload is not wired yet. Saves leave any existing photo unchanged.
          </p>
        </div>
      </div>

      {loadingMe ? (
        <p className="mt-4 text-sm text-ink-muted">Loading your profile…</p>
      ) : null}

      {meQuery.isError ? (
        <p className="mt-4 text-sm text-ink-muted">
          Showing your last saved details. We could not refresh from the server.
        </p>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className={LABEL_CLASS}>Full name</span>
          <input
            id={`${formId}-name`}
            className={INPUT_CLASS}
            value={name}
            disabled={fieldsDisabled}
            onChange={onFieldChange(setName)}
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className={LABEL_CLASS}>Email</span>
          <input
            className={INPUT_CLASS}
            value={email}
            disabled={fieldsDisabled}
            onChange={onFieldChange(setEmail)}
            type="email"
            autoComplete="email"
          />
        </label>
        <label className="block">
          <span className={LABEL_CLASS}>Phone</span>
          <input
            className={INPUT_CLASS}
            value={phone}
            disabled={fieldsDisabled}
            onChange={onFieldChange(setPhone)}
            inputMode="tel"
            autoComplete="tel"
            placeholder="10-digit Indian mobile"
          />
        </label>
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <p className={LABEL_CLASS}>Login method</p>
        <span className="mt-1.5 inline-flex rounded-md border border-brand/30 bg-brand/5 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
          {user?.method === 'google' ? 'Google' : 'OTP'}
        </span>

        {error ? (
          <p className="mt-3 text-sm font-medium text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={fieldsDisabled}
            className="w-full rounded-md bg-highlight px-8 py-2.5 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark disabled:opacity-60 sm:w-auto sm:min-w-[11rem]"
          >
            {busy ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </form>
  )
}
