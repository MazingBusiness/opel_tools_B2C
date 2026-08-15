import { useEffect, useId, useState } from 'react'
import { FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useUiStore } from '../../../app/store/useUiStore'
import { useAuthStore } from '../../../app/store/useAuthStore'
import { useProfileStore } from '../../../app/store/useProfileStore'
import { DEMO_OTP, parseIdentifier } from '../utils/identifier'
import AuthIdentifierStep from './AuthIdentifierStep'
import AuthOtpStep from './AuthOtpStep'

const EMPTY_OTP = ['', '', '', '', '', '']

export default function AuthModal() {
  const isOpen = useUiStore((s) => s.isAuthModalOpen)
  const closeAuthModal = useUiStore((s) => s.closeAuthModal)
  const login = useAuthStore((s) => s.login)
  const ensureProfile = useProfileStore((s) => s.ensureProfile)

  const [step, setStep] = useState('identifier')
  const [identifierInput, setIdentifierInput] = useState('')
  const [resolvedIdentifier, setResolvedIdentifier] = useState('')
  const [digits, setDigits] = useState(EMPTY_OTP)
  const [error, setError] = useState('')
  const titleId = useId()

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event) {
      if (event.key === 'Escape') closeAuthModal()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, closeAuthModal])

  useEffect(() => {
    if (!isOpen) {
      setStep('identifier')
      setIdentifierInput('')
      setResolvedIdentifier('')
      setDigits(EMPTY_OTP)
      setError('')
    }
  }, [isOpen])

  if (!isOpen) return null

  function handleContinue(event) {
    event.preventDefault()
    const parsed = parseIdentifier(identifierInput)
    if (!parsed.ok) {
      setError(parsed.error)
      return
    }
    setError('')
    setResolvedIdentifier(parsed.identifier)
    setDigits(EMPTY_OTP)
    setStep('otp')
    toast.success(`OTP sent to ${parsed.identifier}`)
  }

  function handleVerify(event) {
    event.preventDefault()
    const code = digits.join('')
    if (code.length < 6) {
      setError('Enter the 6-digit OTP.')
      return
    }
    if (code !== DEMO_OTP) {
      setError('Invalid OTP. Use 123456 for this demo.')
      return
    }
    const user = {
      id: `otp-${resolvedIdentifier}`,
      identifier: resolvedIdentifier,
      method: 'otp',
    }
    login(user)
    ensureProfile(user)
    toast.success('Logged in successfully')
    closeAuthModal()
  }

  function handleGoogle() {
    const user = {
      id: 'google-demo',
      identifier: 'google.user@opel.demo',
      method: 'google',
    }
    login(user)
    ensureProfile(user)
    toast.success('Logged in with Google')
    closeAuthModal()
  }

  function handleResend() {
    setDigits(EMPTY_OTP)
    setError('')
    toast.success(`OTP resent to ${resolvedIdentifier}`)
  }

  function handleBack() {
    setStep('identifier')
    setDigits(EMPTY_OTP)
    setError('')
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-secondary/50 p-0 sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeAuthModal()
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
          className="absolute right-3 top-4 rounded-md p-1.5 text-ink-muted transition hover:bg-surface-muted hover:text-ink"
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
