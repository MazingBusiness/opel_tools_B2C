import { FcGoogle } from 'react-icons/fc'
import opelLogo from '../../../assets/images/opelLogo.jpg'

/**
 * @param {{
 *   titleId: string,
 *   identifier: string,
 *   error: string,
 *   onIdentifierChange: (value: string) => void,
 *   onContinue: (event: React.FormEvent) => void,
 *   onGoogle: () => void,
 * }} props
 */
export default function AuthIdentifierStep({
  titleId,
  identifier,
  error,
  onIdentifierChange,
  onContinue,
  onGoogle,
}) {
  return (
    <div className="px-5 pb-6 pt-5 sm:px-7">
      <div className="mb-5 flex flex-col items-center text-center">
        <img
          src={opelLogo}
          alt="OPEL"
          className="mb-3 h-10 w-auto object-contain"
        />
        <h2 id={titleId} className="text-xl font-extrabold tracking-tight text-ink">
          Login or sign up
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Use your phone, email, or Google — one step to get started.
        </p>
      </div>

      <form onSubmit={onContinue} className="flex flex-col gap-3">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Phone or email
          </span>
          <input
            type="text"
            name="identifier"
            autoComplete="username"
            inputMode="email"
            value={identifier}
            onChange={(event) => onIdentifierChange(event.target.value)}
            placeholder="e.g. 9876543210 or you@email.com"
            className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/25"
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? 'auth-identifier-error' : undefined}
          />
        </label>

        {error ? (
          <p id="auth-identifier-error" className="text-sm font-medium text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="mt-1 w-full rounded-md bg-highlight px-4 py-2.5 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark"
        >
          Continue
        </button>
      </form>

      <div className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        onClick={onGoogle}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-brand/40 hover:bg-surface-muted"
      >
        <FcGoogle className="size-5" aria-hidden />
        Continue with Google
      </button>
    </div>
  )
}
