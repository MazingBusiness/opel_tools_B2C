/** Shared auth helpers for the mock login modal. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?\d{10,15}$/

/** Demo OTP accepted by the mock verifier. */
export const DEMO_OTP = '123456'

/**
 * @param {string} raw
 * @returns {{ ok: true, identifier: string, kind: 'email' | 'phone' } | { ok: false, error: string }}
 */
export function parseIdentifier(raw) {
  const value = String(raw ?? '').trim()
  if (!value) {
    return { ok: false, error: 'Enter your phone number or email.' }
  }

  if (value.includes('@')) {
    if (!EMAIL_RE.test(value)) {
      return { ok: false, error: 'Enter a valid email address.' }
    }
    return { ok: true, identifier: value.toLowerCase(), kind: 'email' }
  }

  const phone = value.replace(/[\s\-()]/g, '')
  if (!PHONE_RE.test(phone)) {
    return { ok: false, error: 'Enter a valid phone number (10–15 digits).' }
  }
  return { ok: true, identifier: phone, kind: 'phone' }
}
