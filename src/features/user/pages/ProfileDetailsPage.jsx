import { useEffect, useId, useState } from 'react'
import toast from 'react-hot-toast'
import { useProfileStore } from '../../../app/store/useProfileStore'
import { parseIdentifier } from '../../auth/utils/identifier'
import { useCurrentProfile } from '../hooks/useCurrentProfile'
import { INPUT_CLASS, LABEL_CLASS } from '../utils/profileHelpers'
import ProfileAvatar from '../components/ProfileAvatar'

export default function ProfileDetailsPage() {
  const { user, profile } = useCurrentProfile()
  const updateProfile = useProfileStore((s) => s.updateProfile)
  const formId = useId()

  const [name, setName] = useState(profile?.name ?? '')
  const [email, setEmail] = useState(profile?.email ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl ?? '')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!profile) return
    setName(profile.name)
    setEmail(profile.email)
    setPhone(profile.phone)
    setAvatarUrl(profile.avatarUrl)
  }, [profile])

  function handleAvatar(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.')
      return
    }
    const url = URL.createObjectURL(file)
    setAvatarUrl(url)
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!user) return

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
        setError('Enter a valid 10–15 digit phone number.')
        return
      }
      nextPhone = parsed.identifier
    }

    if (!nextEmail && !nextPhone) {
      setError('Add at least an email or phone number.')
      return
    }

    updateProfile(user.id, {
      name: trimmedName,
      email: nextEmail,
      phone: nextPhone,
      avatarUrl,
    })
    setError('')
    toast.success('Profile updated')
  }

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
          <label className="inline-flex cursor-pointer rounded-md border-2 border-brand px-3 py-2 text-sm font-bold text-brand transition hover:bg-brand hover:text-ink-inverse">
            Upload photo
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleAvatar}
            />
          </label>
          {avatarUrl ? (
            <button
              type="button"
              onClick={() => setAvatarUrl('')}
              className="ml-2 text-sm font-semibold text-ink-muted hover:text-ink"
            >
              Remove
            </button>
          ) : null}
          <p className="mt-1.5 text-xs text-ink-muted">
            Optional. Preview stays on this device until a photo API is wired.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className={LABEL_CLASS}>Full name</span>
          <input
            id={`${formId}-name`}
            className={INPUT_CLASS}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (error) setError('')
            }}
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className={LABEL_CLASS}>Email</span>
          <input
            className={INPUT_CLASS}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (error) setError('')
            }}
            type="email"
            autoComplete="email"
          />
        </label>
        <label className="block">
          <span className={LABEL_CLASS}>Phone</span>
          <input
            className={INPUT_CLASS}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              if (error) setError('')
            }}
            inputMode="tel"
            autoComplete="tel"
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
            className="w-full rounded-md bg-highlight px-8 py-2.5 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark sm:w-auto sm:min-w-[11rem]"
          >
            Save changes
          </button>
        </div>
      </div>
    </form>
  )
}
