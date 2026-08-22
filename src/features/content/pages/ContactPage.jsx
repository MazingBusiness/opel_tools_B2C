import { FiClock, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import ContentPageLayout from '../components/ContentPageLayout'
import ContactForm from '../components/ContactForm'
import { contactPage } from '../data/contact'

export default function ContactPage() {
  const { details } = contactPage

  return (
    <ContentPageLayout title={contactPage.title} lead={contactPage.lead}>
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <ContactForm subjects={contactPage.subjects} />

        <aside className="rounded-lg border border-border bg-surface p-4 sm:p-5">
          <h2 className="text-base font-extrabold tracking-tight text-ink">
            Reach us
          </h2>
          <ul className="mt-4 space-y-4">
            <li className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <FiMail className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Email
                </p>
                <a
                  href={`mailto:${details.email}`}
                  className="text-sm font-medium text-brand hover:text-brand-dark"
                >
                  {details.email}
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <FiPhone className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Phone
                </p>
                <a
                  href={`tel:${details.phone.replace(/\s/g, '')}`}
                  className="text-sm font-medium text-ink"
                >
                  {details.phone}
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <FiClock className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Hours
                </p>
                <p className="text-sm text-ink">{details.hours}</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <FiMapPin className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Address
                </p>
                {details.addressLines.map((line) => (
                  <p key={line} className="text-sm leading-relaxed text-ink">
                    {line}
                  </p>
                ))}
              </div>
            </li>
          </ul>
        </aside>
      </div>
    </ContentPageLayout>
  )
}
