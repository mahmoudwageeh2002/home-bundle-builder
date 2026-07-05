import { FiMinus, FiPlus } from 'react-icons/fi'
import './QuantityStepper.css'

type QuantityStepperProps = {
  value: number
  min?: number
  max?: number
  onDecrement: () => void
  onIncrement: () => void
  compact?: boolean
  label: string
}

export function QuantityStepper({
  compact = false,
  label,
  max = 99,
  min = 0,
  onDecrement,
  onIncrement,
  value,
}: QuantityStepperProps) {
  return (
    <div className={`quantity-stepper ${compact ? 'quantity-stepper--compact' : ''}`.trim()} aria-label={label}>
      <button
        aria-label={`Decrease ${label}`}
        className="quantity-stepper__button"
        disabled={value <= min}
        onClick={onDecrement}
        type="button"
      >
        <FiMinus aria-hidden="true" />
      </button>
      <span className="quantity-stepper__value">{value}</span>
      <button
        aria-label={`Increase ${label}`}
        className="quantity-stepper__button"
        disabled={value >= max}
        onClick={onIncrement}
        type="button"
      >
        <FiPlus aria-hidden="true" />
      </button>
    </div>
  )
}
