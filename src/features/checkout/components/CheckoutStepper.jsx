import { FiCheck } from 'react-icons/fi'
import { CHECKOUT_STEPS } from '../hooks/useCheckout'

/**
 * @param {{
 *   currentStep: string,
 *   onStepClick?: (stepId: string) => void,
 * }} props
 */
export default function CheckoutStepper({ currentStep, onStepClick }) {
  const currentIndex = CHECKOUT_STEPS.findIndex((item) => item.id === currentStep)

  return (
    <nav aria-label="Checkout progress" className="mt-6">
      <ol className="flex items-center justify-between gap-2 sm:justify-start sm:gap-0">
        {CHECKOUT_STEPS.map((step, index) => {
          const isComplete = index < currentIndex
          const isCurrent = step.id === currentStep
          const isClickable = onStepClick && index < currentIndex

          return (
            <li key={step.id} className="flex flex-1 items-center sm:flex-initial">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick?.(step.id)}
                className={`flex flex-col items-center gap-1.5 sm:flex-row sm:gap-2 ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                    isComplete
                      ? 'bg-brand text-ink-inverse'
                      : isCurrent
                        ? 'border-2 border-brand bg-brand/10 text-brand'
                        : 'border border-border bg-surface text-ink-muted'
                  }`}
                >
                  {isComplete ? <FiCheck className="size-4" aria-hidden /> : index + 1}
                </span>
                <span
                  className={`text-[11px] font-semibold sm:text-sm ${
                    isCurrent ? 'text-brand' : isComplete ? 'text-ink' : 'text-ink-muted'
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {index < CHECKOUT_STEPS.length - 1 ? (
                <span
                  className={`mx-2 hidden h-px flex-1 sm:block sm:w-12 lg:w-16 ${
                    index < currentIndex ? 'bg-brand' : 'bg-border'
                  }`}
                  aria-hidden
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
