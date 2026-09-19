/**
 * @param {Record<string, unknown>} row
 */
export function mapAddressApiItem(row) {
  if (!row) return null
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    phone: String(row.phone ?? ''),
    line1: String(row.line1 ?? ''),
    line2: String(row.line2 ?? ''),
    city: String(row.city ?? ''),
    state: String(row.state ?? ''),
    pincode: String(row.pincode ?? ''),
    type: row.type === 'work' ? 'work' : 'home',
    isDefault: Boolean(row.is_default),
  }
}

/**
 * FE form payload → API body.
 * On PATCH, only send is_default when true — unchecking default on the current
 * default must not hit the API's 422 (use Set default on another address).
 *
 * @param {Record<string, unknown>} address
 * @param {{ forUpdate?: boolean }} [options]
 */
export function toAddressApiBody(address, options = {}) {
  const { forUpdate = false } = options
  /** @type {Record<string, unknown>} */
  const body = {
    name: String(address.name ?? '').trim(),
    phone: String(address.phone ?? '').trim(),
    line1: String(address.line1 ?? '').trim(),
    line2: String(address.line2 ?? '').trim() || null,
    city: String(address.city ?? '').trim(),
    state: String(address.state ?? '').trim(),
    pincode: String(address.pincode ?? '').trim(),
    type: address.type === 'work' ? 'work' : 'home',
  }

  if (forUpdate) {
    if (address.isDefault) body.is_default = true
  } else {
    body.is_default = Boolean(address.isDefault)
  }

  return body
}
