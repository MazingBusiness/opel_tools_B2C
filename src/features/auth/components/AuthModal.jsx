import { useEffect, useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useUiStore } from '../../../app/store/useUiStore'
import { useAuthStore } from '../../../app/store/useAuthStore'
import { useProfileStore } from '../../../app/store/useProfileStore'
import { getErrorMessage } from '../../../shared/api/client'
import { parseIdentifier } from '../utils/identifier'
import { useRequestOtpMutation, useVerifyOtpMutation } from '../api/hooks'
import AuthIdentifierStep from './AuthIdentifierStep'
import AuthOtpStep from './AuthOtpStep'

const EMPTY_OTP = ['', '', '', '', '', '']
const DEFAULT_RESEND_COOLDOWN_SECONDS = 120

/**
 * @param {unknown} expiresIn
 */
function normalizeExpiresIn(expiresIn) {
  const n = Number(expiresIn)
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_RESEND_COOLDOWN_SECONDS
  return Math.floor(n)
}

export default function AuthModal() {
  const isOpen = useUiStore((s) => s.isAuthModalOpen)
  const closeAuthModal = useUiStore((s) => s.closeAuthModal)
  const ensureProfile = useProfileStore((s) => s.ensureProfile)
  const updateProfile = useProfileStore((s) => s.updateProfile)
  const navigate = useNavigate()

  const requestOtp = useRequestOtpMutation()
  const verifyOtp = useVerifyOtpMutation()

  const [step, setStep] = useState('identifier')
  const [identifierInput, setIdentifierInput] = useState('')
  const [resolvedIdentifier, setResolvedIdentifier] = useState('')
  const [digits, setDigits] = useState(EMPTY_OTP)
  const [error, setError] = useState('')
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(
    DEFAULT_RESEND_COOLDOWN_SECONDS,
  )
  const [resendEpoch, setResendEpoch] = useState(0)
  const titleId = useId()

  const busy = requestOtp.isPending || verifyOtp.isPending

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event) {
      if (event.key === 'Escape' && !busy) closeAuthModal()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, closeAuthModal, busy])

  useEffect(() => {
    if (!isOpen) {
      setStep('identifier')
      setIdentifierInput('')
      setResolvedIdentifier('')
      setDigits(EMPTY_OTP)
      setError('')
      setResendCooldownSeconds(DEFAULT_RESEND_COOLDOWN_SECONDS)
      setResendEpoch(0)
      requestOtp.reset()
      verifyOtp.reset()
    }
    // Only reset when the modal closes/opens — not on mutation identity churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  if (!isOpen) return null

  /**
   * @param {number} expiresIn
   */
  function startResendCooldown(expiresIn) {
    setResendCooldownSeconds(normalizeExpiresIn(expiresIn))
    setResendEpoch((epoch) => epoch + 1)
  }

  /**
   * @param {import('../../../app/store/useAuthStore').AuthUser} user
   * @param {boolean} profileComplete
   */
  function finishLogin(user, profileComplete) {
    // Seed / fill blank local profile fields from the API user (email/phone/name).
    ensureProfile(user)
    const local = useProfileStore.getState().byUserId[user.id]
    if (local) {
      updateProfile(user.id, {
        ...(user.name ? { name: user.name } : {}),
        ...(user.email ? { email: user.email } : {}),
        ...(user.phone ? { phone: user.phone } : {}),
        ...(user.avatar ? { avatarUrl: user.avatar } : {}),
      })
    }
    toast.success('Logged in successfully')
    closeAuthModal()
    if (!profileComplete) {
      navigate('/profile/details')
      toast('Complete your profile to continue')
    }
  }

  async function handleContinue(event) {
    event.preventDefault()
    if (busy) return

    const parsed = parseIdentifier(identifierInput)
    if (!parsed.ok) {
      setError(parsed.error)
      return
    }

    setError('')
    try {
      const data = await requestOtp.mutateAsync(parsed.identifier)
      setResolvedIdentifier(parsed.identifier)
      setDigits(EMPTY_OTP)
      startResendCooldown(data.expires_in)
      setStep('otp')
      toast.success(`OTP sent to ${parsed.identifier}`)
    } catch (err) {
      setError(getErrorMessage(err, 'Could not send OTP. Please try again.'))
    }
  }

  async function handleVerify(event) {
    event.preventDefault()
    if (busy) return

    const code = digits.join('')
    if (code.length < 6) {
      setError('Enter the 6-digit OTP.')
      return
    }

    setError('')
    try {
      const data = await verifyOtp.mutateAsync({
        identifier: resolvedIdentifier,
        code,
      })
      const user = useAuthStore.getState().user
      if (!user) {
        setError('Login succeeded but session was not saved. Please try again.')
        return
      }
      finishLogin(user, Boolean(data.profile_complete ?? data.user?.profile_complete))
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid or expired OTP. Please try again.'))
    }
  }

  async function handleResend() {
    if (busy || !resolvedIdentifier) return
    setDigits(EMPTY_OTP)
    setError('')
    try {
      const data = await requestOtp.mutateAsync(resolvedIdentifier)
      startResendCooldown(data.expires_in)
      toast.success(`OTP resent to ${resolvedIdentifier}`)
    } catch (err) {
      setError(getErrorMessage(err, 'Could not resend OTP. Please try again.'))
    }
  }

  function handleBack() {
    if (busy) return
    setStep('identifier')
    setDigits(EMPTY_OTP)
    setError('')
    setResendCooldownSeconds(DEFAULT_RESEND_COOLDOWN_SECONDS)
    setResendEpoch(0)
  }

  function handleGoogle() {
    toast('Google sign-in is coming soon.')
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-secondary/50 p-0 sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) closeAuthModal()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md overflow-hidden rounded-t-2xl bg-surface shadow-xl sm:rounded-xl"
      >
        <div className="h-1.5 w-full bg-brand" aria-hidden />

        <button
          type="button"
          onClick={closeAuthModal}
          disabled={busy}
          className="absolute right-3 top-4 rounded-md p-1.5 text-ink-muted transition hover:bg-surface-muted hover:text-ink disabled:opacity-50"
          aria-label="Close"
        >
          <FiX className="size-5" />
        </button>

        <span className="sr-only">Authentication</span>

        {step === 'identifier' ? (
          <AuthIdentifierStep
            titleId={titleId}
            identifier={identifierInput}
            error={error}
            busy={busy}
            onIdentifierChange={(value) => {
              setIdentifierInput(value)
              if (error) setError('')
            }}
            onContinue={handleContinue}
            onGoogle={handleGoogle}
          />
        ) : (
          <AuthOtpStep
            titleId={titleId}
            identifier={resolvedIdentifier}
            digits={digits}
            error={error}
            busy={busy}
            resendCooldownSeconds={resendCooldownSeconds}
            resendEpoch={resendEpoch}
            onDigitsChange={(next) => {
              setDigits(next)
              if (error) setError('')
            }}
            onVerify={handleVerify}
            onResend={handleResend}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  )
}
