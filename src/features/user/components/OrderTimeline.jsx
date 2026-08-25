/**
 * @param {{
 *   timeline: Array<{
 *     key: string,
 *     label: string,
 *     at: string,
 *     done: boolean,
 *     current: boolean,
 *   }>
 * }} props
 */
export default function OrderTimeline({ timeline }) {
  return (
    <ol className="space-y-0">
      {timeline.map((step, index) => (
        <li key={step.key} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              className={`size-3 shrink-0 rounded-full ${
                step.done ? 'bg-brand' : 'border-2 border-border bg-surface'
              } ${step.current ? 'ring-4 ring-brand/20' : ''}`}
            />
            {index < timeline.length - 1 ? (
              <span
                className={`w-px flex-1 min-h-8 ${
                  step.done && timeline[index + 1].done ? 'bg-brand' : 'bg-border'
                }`}
              />
            ) : null}
          </div>
          <div className="pb-4">
            <p
              className={`text-sm font-semibold ${
                step.done ? 'text-ink' : 'text-ink-muted'
              }`}
            >
              {step.label}
            </p>
            {step.at ? (
              <p className="text-xs text-ink-muted">{step.at}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
}
