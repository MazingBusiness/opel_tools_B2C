import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiHeart,
  FiLogOut,
  FiMapPin,
  FiPackage,
  FiShoppingCart,
  FiTruck,
  FiUser,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useUiStore } from '../store/useUiStore'
import { useAuthStore } from '../store/useAuthStore'
import { useProfileStore } from '../store/useProfileStore'
import { useCartStore } from '../store/useCartStore'
import { useWishlistStore } from '../store/useWishlistStore'
import { getCartTotals } from '../../features/cart/utils/cartTotals'
import ProfileAvatar from '../../features/user/components/ProfileAvatar'

function truncateIdentifier(identifier) {
  if (!identifier) return 'Account'
  if (identifier.length <= 14) return identifier
  return `${identifier.slice(0, 12)}…`
}

function displayLabel(profile, identifier) {
  const name = profile?.name?.trim()
  if (name && name !== 'OPEL Customer') {
    return name.split(/\s+/)[0]
  }
  return truncateIdentifier(identifier)
}

export default function HeaderActions() {
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef(null)
  const navigate = useNavigate()

  const openAuthModal = useUiStore((s) => s.openAuthModal)
  const openCart = useUiStore((s) => s.openCart)
  const openWishlist = useUiStore((s) => s.openWishlist)
  const cartItems = useCartStore((s) => s.items)
  const cartCount = getCartTotals(cartItems).itemCount
  const wishlistCount = useWishlistStore((s) => s.items.length)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const ensureProfile = useProfileStore((s) => s.ensureProfile)
  const hasHydrated = useProfileStore((s) => s.hasHydrated)
  const profile = useProfileStore((s) =>
    user ? s.byUserId[user.id] ?? null : null,
  )

  useEffect(() => {
    if (hasHydrated && user) ensureProfile(user)
  }, [hasHydrated, user, ensureProfile])

  useEffect(() => {
    function handleClickOutside(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleLogout() {
    logout()
    setAccountOpen(false)
    toast.success('Logged out')
    navigate('/')
  }

  return (
    <div className="flex shrink-0 items-center gap-1 sm:gap-3">
      {user ? (
        <div className="relative" ref={accountRef}>
          <button
            type="button"
            onClick={() => setAccountOpen((open) => !open)}
            className="flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-ink transition hover:text-brand"
            aria-expanded={accountOpen}
            aria-haspopup="menu"
          >
            {profile?.name ? (
              <ProfileAvatar
                name={profile.name}
                avatarUrl={profile.avatarUrl}
                size="xs"
              />
            ) : (
              <FiUser className="size-5" />
            )}
            <span className="hidden max-w-24 truncate text-[11px] font-medium lg:inline">
              {displayLabel(profile, user.identifier)}
            </span>
          </button>
          {accountOpen ? (
            <div
              role="menu"
              className="absolute right-0 z-50 mt-1 min-w-48 rounded-md border border-border bg-surface py-1 shadow-md"
            >
              <p className="truncate border-b border-border px-3 py-2 text-xs text-ink-muted">
                {profile?.name ? `${profile.name} · ` : ''}
                {user.identifier}
              </p>
              <Link
                to="/profile"
                role="menuitem"
                onClick={() => setAccountOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-surface-muted"
              >
                <FiUser className="size-4" />
                My Account
              </Link>
              <Link
                to="/profile/orders"
                role="menuitem"
                onClick={() => setAccountOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-surface-muted"
              >
                <FiPackage className="size-4" />
                My Orders
              </Link>
              <Link
                to="/profile/addresses"
                role="menuitem"
                onClick={() => setAccountOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-surface-muted"
              >
                <FiMapPin className="size-4" />
                Addresses
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-surface-muted"
              >
                <FiLogOut className="size-4" />
                Logout
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          onClick={openAuthModal}
          className="flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-ink transition hover:text-brand"
        >
          <FiUser className="size-5" />
          <span className="hidden text-[11px] font-medium lg:inline">Login Now</span>
        </button>
      )}

      <button
        type="button"
        onClick={openWishlist}
        className="relative flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-ink transition hover:text-brand"
        aria-label={
          wishlistCount > 0 ? `Wishlist, ${wishlistCount} items` : 'Wishlist'
        }
      >
        <FiHeart className="size-5" />
        {wishlistCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-ink-inverse">
            {wishlistCount > 99 ? '99+' : wishlistCount}
          </span>
        ) : null}
        <span className="hidden text-[11px] font-medium lg:inline">Wishlist</span>
      </button>

      <Link
        to="/orders"
        className="flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-ink transition hover:text-brand"
      >
        <FiTruck className="size-5" />
        <span className="hidden text-[11px] font-medium lg:inline">Track Order</span>
      </Link>

      <button
        type="button"
        onClick={openCart}
        className="relative flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-ink transition hover:text-brand"
        aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : 'Cart'}
      >
        <FiShoppingCart className="size-5" />
        {cartCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-ink-inverse">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        ) : null}
        <span className="hidden text-[11px] font-medium lg:inline">Cart</span>
      </button>
    </div>
  )
}
