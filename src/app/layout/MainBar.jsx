import { Link } from 'react-router-dom'
import { FiMapPin } from 'react-icons/fi'
import opelLogo from '../../assets/images/opelLogo.jpg'
import { useUiStore } from '../store/useUiStore'
import { useLocationStore } from '../store/useLocationStore'
import HeaderSearch from './HeaderSearch'
import HeaderActions from './HeaderActions'

export default function MainBar() {
  const openLocationDialog = useUiStore((s) => s.openLocationDialog)
  const location = useLocationStore((s) => s.location)

  const primary = location
    ? `${location.city}${location.pincode ? ` ${location.pincode}` : ''}`
    : 'Location not set'
  const secondary = location
    ? 'Change location >'
    : 'Select delivery location >'

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
              onClick={openLocationDialog}
              className="flex min-w-0 max-w-36 items-start gap-1.5 text-left sm:max-w-40 lg:max-w-52"
            >
              <FiMapPin className="mt-0.5 size-4 shrink-0 text-brand" />
              <span className="min-w-0">
                <span className="block truncate text-xs text-ink">{primary}</span>
                <span className="block truncate text-xs font-medium text-brand">
                  {secondary}
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
