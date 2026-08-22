import { Link } from 'react-router-dom'
import {
  FiFacebook,
  FiHeadphones,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiPackage,
  FiShield,
  FiTruck,
  FiYoutube,
} from 'react-icons/fi'
import { FaXTwitter } from 'react-icons/fa6'

const trustItems = [
  {
    icon: FiPackage,
    title: 'Professional Tools',
    description: 'Industrial-grade power tools built for job-site performance.',
  },
  {
    icon: FiTruck,
    title: 'Reliable Delivery',
    description: 'Fast dispatch across serviceable pincodes nationwide.',
  },
  {
    icon: FiShield,
    title: 'Secure Checkout',
    description: 'Encrypted payments with trusted payment partners.',
  },
  {
    icon: FiHeadphones,
    title: 'Expert Support',
    description: 'Product guidance and after-sales help when you need it.',
  },
]

const linkColumns = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Careers', to: '/' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'My Account', to: '/profile' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'Track Order', to: '/orders' },
      { label: 'Shipping Info', to: '/' },
      { label: 'Returns', to: '/' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { label: 'All Products', to: '/products' },
      { label: 'Best Sellers', to: '/products' },
      { label: 'New Arrivals', to: '/products' },
    ],
  },
  {
    title: 'Policies',
    links: [
      { label: 'Privacy Policy', to: '/' },
      { label: 'Terms of Use', to: '/' },
      { label: 'Warranty', to: '/' },
    ],
  },
]

const socialLinks = [
  { icon: FiFacebook, label: 'Facebook', href: '#' },
  { icon: FiYoutube, label: 'YouTube', href: '#' },
  { icon: FiLinkedin, label: 'LinkedIn', href: '#' },
  { icon: FaXTwitter, label: 'X', href: '#' },
  { icon: FiInstagram, label: 'Instagram', href: '#' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      {/* Trust strip — inspired by marketplace footers, OPEL copy + brand accents */}
      <div className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-ink">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Link columns */}
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {linkColumns.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
              {column.title}
            </h3>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-ink-muted transition hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Contact + social */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-6 sm:flex-row sm:items-center">
          <a
            href="mailto:support@opeltools.com"
            className="group flex items-start gap-2"
          >
            <FiMail className="mt-0.5 size-5 text-brand" aria-hidden />
            <span>
              <span className="block text-sm font-medium text-brand group-hover:text-brand-dark">
                support@opeltools.com
              </span>
              <span className="mt-0.5 block text-xs text-ink-muted">
                Questions about orders or products? Reach out anytime.
              </span>
            </span>
          </a>

          <div className="flex items-center gap-2">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border border-border text-ink transition hover:border-brand hover:bg-brand hover:text-ink-inverse"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Legal bar */}
      <div className="bg-surface-muted">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap gap-x-3 gap-y-1">
            <Link to="/" className="hover:text-brand">
              Terms of Use
            </Link>
            <span aria-hidden>|</span>
            <Link to="/" className="hover:text-brand">
              Privacy Policy
            </Link>
            <span aria-hidden>|</span>
            <Link to="/" className="hover:text-brand">
              Warranty
            </Link>
          </nav>
          <p>
            OPEL Tools © {year}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
