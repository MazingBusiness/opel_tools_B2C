import { Link } from 'react-router-dom'
import { FiMapPin } from 'react-icons/fi'
import opelLogo from '../../assets/images/opelLogo.jpg'
import HeaderSearch from './HeaderSearch'
import HeaderActions from './HeaderActions'

export default function MainBar() {
  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:gap-4">
        <div className="flex items-center justify-between gap-3 md:contents">
          <div className="flex min-w-0 items-center gap-3 md:gap-4">
            <Link to="/" className="shrink-0">
              <img
                src={opelLogo}
                alt="OPEL Tools"
                className="h-9 w-auto object-contain sm:h-10"
              />
            </Link>

            <button
              type="button"
              className="hidden min-w-0 items-start gap-1.5 text-left sm:flex md:max-w-40 lg:max-w-52"
            >
              <FiMapPin className="mt-0.5 size-4 shrink-0 text-brand" />
              <span className="min-w-0">
                <span className="block truncate text-xs text-ink">Location not set</span>
                <span className="block truncate text-xs font-medium text-brand">
                  Select delivery location &gt;
                </span>
              </span>
            </button>
          </div>

          <div className="md:order-last">
            <HeaderActions />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <HeaderSearch />
        </div>
      </div>
    </div>
  )
}
