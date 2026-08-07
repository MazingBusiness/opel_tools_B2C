import { useEffect, useRef } from 'react'
import { DEMO_OTP } from '../utils/identifier'

/**
 * @param {{
 *   titleId: string,
 *   identifier: string,
 *   digits: string[],
 *   error: string,
 *   onDigitsChange: (digits: string[]) => void,
 *   onVerify: (event: React.FormEvent) => void,
 *   onResend: () => void,
 *   onBack: () => void,
 * }} props
 */
export default function AuthOtpStep({
  titleId,
  identifier,
  digits,
  error,
  onDigitsChange,
  onVerify,
  onResend,
  onBack,
}) {
  const inputsRef = useRef([])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  function setDigitAt(index, value) {
    const next = [...digits]
    next[index] = value
    onDigitsChange(next)
  }

  function handleChange(index, event) {
    const raw = event.target.value.replace(/\D/g, '')
    if (!raw) {
      setDigitAt(index, '')
      return
    }

    if (raw.length > 1) {
      const chars = raw.slice(0, 6 - index).split('')
      const next = [...digits]
      chars.forEach((char, offset) => {
        next[index + offset] = char
      })
      onDigitsChange(next)
      const focusIndex = Math.min(index + chars.length, 5)
      inputsRef.current[focusIndex]?.focus()
      return
    }

    setDigitAt(index, raw)
    if (index < 5) inputsRef.current[index + 1]?.focus()
  }

  function handleKeyDown(index, event) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  function handlePaste(event) {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = Array.from({ length: 6 }, (_, i) => pasted[i] ?? '')
    onDigitsChange(next)
    inputsRef.current[Math.min(pasted.length, 5)]?.focus()
  }

  return (
    <div className="px-5 pb-6 pt-5 sm:px-7">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm font-semibold text-brand transition hover:text-brand-dark"
      >
        ← Change phone / email
      </button>

      <h2 id={titleId} className="text-xl font-extrabold tracking-tight text-ink">
        Enter OTP
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        We sent a code to <span className="font-semibold text-ink">{identifier}</span>
      </p>
      <p className="mt-1 text-xs text-ink-muted">
        Demo: use <span className="font-mono font-semibold text-brand">{DEMO_OTP}</span>
      </p>

      <form onSubmit={onVerify} className="mt-5 flex flex-col gap-4">
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(node) => {
                inputsRef.current[index] = node
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              maxLength={6}
              value={digit}
              onChange={(event) => handleChange(index, event)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              aria-label={`Digit ${index + 1}`}
              className="size-11 rounded-md border border-border bg-surface text-center text-lg font-bold text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/25 sm:size-12"
            />
          ))}
        </div>

        {error ? (
          <p className="text-sm font-medium text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-md bg-highlight px-4 py-2.5 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark"
        >
          Verify &amp; continue
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-ink-muted">
        Didn&apos;t get it?{' '}
        <button
          type="button"
          onClick={onResend}
          className="font-semibold text-brand transition hover:text-brand-dark"
        >
          Resend OTP
        </button>
      </p>
    </div>
  )
}
