import { useState } from 'react'
import toast from 'react-hot-toast'
import { parseIdentifier } from '../../auth/utils/identifier'

const INPUT_CLASS =
  'w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/25'

const LABEL_CLASS =
  'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted'

const EMPTY_FORM = {
  name: '',
  identifier: '',
  subject: '',
  message: '',
}

/**
 * Dummy contact form — submits locally with a toast, no API.
 *
 * @param {{ subjects: string[] }} props
 */
export default function ContactForm({ subjects }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (error) setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.name.trim()) {
      setError('Enter your name.')
      return
    }
    const parsed = parseIdentifier(form.identifier)
    if (!parsed.ok) {
      setError('Enter a valid email or phone number.')
      return
    }
    if (!form.subject) {
      setError('Choose a subject.')
      return
    }
    if (form.message.trim().length < 10) {
      setError('Tell us a bit more (at least 10 characters).')
      return
    }

    setForm(EMPTY_FORM)
    toast.success('Message sent. We will get back to you shortly.')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-surface p-4 sm:p-5"
      noValidate
    >
      <h2 className="text-base font-extrabold tracking-tight text-ink">
        Send a message
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        Dummy form — nothing is stored or emailed yet.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className={LABEL_CLASS}>Name</span>
          <input
            className={INPUT_CLASS}
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            autoComplete="name"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className={LABEL_CLASS}>Email or phone</span>
          <input
            className={INPUT_CLASS}
            value={form.identifier}
            onChange={(e) => setField('identifier', e.target.value)}
            autoComplete="email"
            placeholder="you@company.com"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className={LABEL_CLASS}>Subject</span>
          <select
            className={INPUT_CLASS}
            value={form.subject}
            onChange={(e) => setField('subject', e.target.value)}
          >
            <option value="">Select a topic</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className={LABEL_CLASS}>Message</span>
          <textarea
            className={`${INPUT_CLASS} min-h-32 resize-y`}
            value={form.message}
            onChange={(e) => setField('message', e.target.value)}
            placeholder="How can we help?"
          />
        </label>
      </div>

      {error ? (
        <p className="mt-3 text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="mt-4 rounded-md bg-highlight px-4 py-2.5 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark"
      >
        Send message
      </button>
    </form>
  )
}
