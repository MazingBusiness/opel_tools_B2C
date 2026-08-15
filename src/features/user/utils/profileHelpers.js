import { parseIdentifier } from '../../auth/utils/identifier'

export const INPUT_CLASS =
  'w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/25'

export const LABEL_CLASS =
  'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted'

/**
 * @param {string} [name]
 */
export function getInitials(name) {
  const parts = String(name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!parts.length) return 'O'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

/**
 * @param {string} email
 */
export function nameFromEmail(email) {
  const local = String(email ?? '').split('@')[0] ?? ''
  const words = local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  return words.join(' ') || 'OPEL Customer'
}

/**
 * @param {string} name
 * @param {string} phone
 */
export function seedAddresses(name, phone) {
  const displayName = name || 'OPEL Customer'
  const displayPhone = phone || '9876543210'
  return [
    {
      id: 'addr-home',
      name: displayName,
      phone: displayPhone,
      line1: '12 Industrial Layout, 3rd Cross',
      line2: 'Near Power Tools Market',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      type: 'home',
      isDefault: true,
    },
    {
      id: 'addr-work',
      name: displayName,
      phone: displayPhone,
      line1: 'Warehouse 4, Peenya Industrial Area',
      line2: '',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560058',
      type: 'work',
      isDefault: false,
    },
  ]
}

/**
 * @param {{ id: string, identifier: string, method: string }} user
 */
export function createSeedProfile(user) {
  const parsed = parseIdentifier(user.identifier)
  const kind = parsed.ok
    ? parsed.kind
    : String(user.identifier ?? '').includes('@')
      ? 'email'
      : 'phone'
  const identifier = parsed.ok ? parsed.identifier : user.identifier

  const email = kind === 'email' ? identifier : ''
  const phone = kind === 'phone' ? identifier : ''
  const name = kind === 'email' ? nameFromEmail(identifier) : 'OPEL Customer'

  return {
    name,
    email,
    phone,
    avatarUrl: '',
    passwordSet: false,
    addresses: seedAddresses(name, phone),
  }
}

/**
 * @param {{ name?: string, email?: string, phone?: string, passwordSet?: boolean, addresses?: unknown[] }} profile
 */
export function getCompleteness(profile) {
  if (!profile) return 0
  const checks = [
    Boolean(profile.name && profile.name !== 'OPEL Customer'),
    Boolean(profile.email),
    Boolean(profile.phone),
    Boolean(profile.passwordSet),
    Boolean(profile.addresses?.length),
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export function newAddressId() {
  return `addr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export const EMPTY_ADDRESS = {
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  type: 'home',
  isDefault: false,
}
