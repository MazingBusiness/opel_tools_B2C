import {
  FiGrid,
  FiHeart,
  FiMapPin,
  FiPackage,
  FiShield,
  FiUser,
} from 'react-icons/fi'

export const PROFILE_NAV = [
  { to: '/profile', label: 'Overview', end: true, icon: FiGrid },
  { to: '/profile/details', label: 'Profile details', end: false, icon: FiUser },
  { to: '/profile/addresses', label: 'Addresses', end: false, icon: FiMapPin },
  { to: '/profile/orders', label: 'My orders', end: false, icon: FiPackage },
  { to: '/wishlist', label: 'Wishlist', end: false, icon: FiHeart },
  { to: '/profile/security', label: 'Security', end: false, icon: FiShield },
]

/**
 * @param {string} pathname
 */
export function getProfileSectionLabel(pathname) {
  if (pathname.startsWith('/profile/orders/')) return 'Order details'
  const match = PROFILE_NAV.find((item) =>
    item.end ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`),
  )
  return match?.label ?? 'Overview'
}
