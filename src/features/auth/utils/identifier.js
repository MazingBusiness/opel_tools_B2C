/** Shared auth helpers for identifier validation (aligned with Laravel LoginIdentifier). */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Normalize / validate an Indian mobile number the same way the API does.
 * Accepts 10-digit, 0-prefixed 11-digit, or 91-prefixed 12-digit input.
 *
 * @param {string} raw
 * @returns {{ ok: true, identifier: string } | { ok: false, error: string }}
 */
export function parseIndianPhone(raw) {
  let digits = String(raw ?? '').replace(/\D+/g, '')

  if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.slice(1)
  }

  if (digits.length === 10) {
    digits = `91${digits}`
  }

  if (digits.length !== 12 || !digits.startsWith('91')) {
    return { ok: false, error: 'Enter a valid 10-digit Indian mobile number.' }
  }

  const subscriber = digits.slice(2)
  if (!/^[6-9]\d{9}$/.test(subscriber)) {
    return { ok: false, error: 'Enter a valid 10-digit Indian mobile number.' }
  }

  return { ok: true, identifier: digits }
}

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

  const phone = parseIndianPhone(value)
  if (!phone.ok) return phone
  return { ok: true, identifier: phone.identifier, kind: 'phone' }
}
