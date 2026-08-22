import toast from 'react-hot-toast'
import { FiBriefcase, FiMapPin } from 'react-icons/fi'
import ContentPageLayout from '../components/ContentPageLayout'
import { careersPage } from '../data/careers'

export default function CareersPage() {
  return (
    <ContentPageLayout
      title={careersPage.title}
      lead={careersPage.lead}
      sections={careersPage.sections}
    >
      <div className="mt-8 max-w-3xl space-y-4">
        <h2 className="text-lg font-extrabold tracking-tight text-ink">
          Open roles
        </h2>
        {careersPage.jobs.map((job) => (
          <article
            key={job.id}
            className="rounded-lg border border-border bg-surface p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold tracking-tight text-ink">
                  {job.title}
                </h3>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                  <span className="inline-flex items-center gap-1">
                    <FiMapPin className="size-3.5" aria-hidden />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FiBriefcase className="size-3.5" aria-hidden />
                    {job.type}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast.success('Application coming soon')}
                className="rounded-md border-2 border-brand px-3 py-2 text-sm font-bold text-brand transition hover:bg-brand hover:text-ink-inverse"
              >
                Apply
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {job.summary}
            </p>
          </article>
        ))}
      </div>
    </ContentPageLayout>
  )
}
