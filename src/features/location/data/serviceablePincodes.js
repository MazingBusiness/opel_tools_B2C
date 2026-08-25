/**
 * Demo pincode → place lookup. Unknown 6-digit codes still count as
 * serviceable with a generic label so the flow works nationwide in demo.
 *
 * @type {Record<string, { city: string, state: string, serviceable: boolean }>}
 */
export const PINCODE_DIRECTORY = {
  '110001': { city: 'New Delhi', state: 'Delhi', serviceable: true },
  '110016': { city: 'New Delhi', state: 'Delhi', serviceable: true },
  '400001': { city: 'Mumbai', state: 'Maharashtra', serviceable: true },
  '400051': { city: 'Mumbai', state: 'Maharashtra', serviceable: true },
  '560001': { city: 'Bengaluru', state: 'Karnataka', serviceable: true },
  '560034': { city: 'Bengaluru', state: 'Karnataka', serviceable: true },
  '560058': { city: 'Bengaluru', state: 'Karnataka', serviceable: true },
  '560100': { city: 'Bengaluru', state: 'Karnataka', serviceable: true },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', serviceable: true },
  '700001': { city: 'Kolkata', state: 'West Bengal', serviceable: true },
  '500001': { city: 'Hyderabad', state: 'Telangana', serviceable: true },
  '411001': { city: 'Pune', state: 'Maharashtra', serviceable: true },
  /** Demo unserviceable remote code */
  '999999': { city: 'Remote Area', state: 'India', serviceable: false },
}

/**
 * @param {string} pincode
 * @returns {{
 *   ok: boolean,
 *   error?: string,
 *   pincode?: string,
 *   city?: string,
 *   state?: string,
 *   serviceable?: boolean,
 * }}
 */
export function lookupPincode(pincode) {
  const trimmed = String(pincode ?? '').trim()
  if (!/^\d{6}$/.test(trimmed)) {
    return { ok: false, error: 'Enter a valid 6-digit pincode.' }
  }

  const known = PINCODE_DIRECTORY[trimmed]
  if (known) {
    if (!known.serviceable) {
      return {
        ok: false,
        error: 'Sorry, we do not deliver to this pincode yet.',
        pincode: trimmed,
        city: known.city,
        state: known.state,
        serviceable: false,
      }
    }
    return {
      ok: true,
      pincode: trimmed,
      city: known.city,
      state: known.state,
      serviceable: true,
    }
  }

  return {
    ok: true,
    pincode: trimmed,
    city: 'Your area',
    state: 'India',
    serviceable: true,
  }
}
