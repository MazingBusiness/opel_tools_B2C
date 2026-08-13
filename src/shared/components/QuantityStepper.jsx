import { FiMinus, FiPlus } from 'react-icons/fi'

/**
 * @param {{
 *   value: number,
 *   onChange: (value: number) => void,
 *   min?: number,
 *   max?: number,
 *   className?: string,
 * }} props
 */
export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className = '',
}) {
  function decrement() {
    onChange(Math.max(min, value - 1))
  }

  function increment() {
    onChange(Math.min(max, value + 1))
  }

  function handleInputChange(event) {
    const parsed = Number.parseInt(event.target.value, 10)
    if (Number.isNaN(parsed)) return
    onChange(Math.min(max, Math.max(min, parsed)))
  }

  return (
    <div className={`inline-flex items-center rounded-md border border-border ${className}`}>
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className="flex size-10 items-center justify-center text-ink-muted transition hover:bg-surface-muted hover:text-ink disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        <FiMinus className="size-4" />
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={handleInputChange}
        className="w-12 border-x border-border bg-surface py-2 text-center text-sm font-semibold text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className="flex size-10 items-center justify-center text-ink-muted transition hover:bg-surface-muted hover:text-ink disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <FiPlus className="size-4" />
      </button>
    </div>
  )
}
