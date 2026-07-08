import { FiCheckCircle } from 'react-icons/fi'
import { Button } from '../../../shared/components/Button/Button'
import { QuantityStepper } from '../../../shared/components/QuantityStepper/QuantityStepper'
import { reviewIcons } from '../data/icons'
import type { ProductCategory, ReviewLine } from '../types/bundle'
import { formatCurrency, getLineCompareTotal, getLineCurrentTotal } from '../utils'
import type { useBundleBuilder } from '../hooks/useBundleBuilder'

type BuilderApi = ReturnType<typeof useBundleBuilder>

type ReviewPanelProps = {
  api: BuilderApi
  copy: {
    title: string
    description: string
    guaranteeTitle: string
    guaranteeCopy: string
    financingLabel: string
    savingsMessage: string
  }
  onCheckout: () => void
  onSave: () => void
}

const reviewGroups: Array<{ category: ProductCategory; label: string }> = [
  { category: 'cameras', label: 'Cameras' },
  { category: 'sensors', label: 'Sensors' },
  { category: 'accessories', label: 'Accessories' },
  { category: 'plan', label: 'Home monitoring plan' },
]

function getLineName(line: ReviewLine) {
  const baseName = line.product.reviewLabel ?? line.product.name

  if (line.variant && line.selectedVariantCount > 1) {
    return `${baseName} - ${line.variant.label}`
  }

  return baseName
}

function ReviewLineItem({ api, line }: { api: BuilderApi; line: ReviewLine }) {
  const compareTotal = getLineCompareTotal(line)
  const currentTotal = getLineCurrentTotal(line)
  const hasDiscount = compareTotal > currentTotal

  return (
    <li className="review-line">
      <img alt="" className="review-line__thumb" src={line.product.image} />
      <span className="review-line__name">{getLineName(line)}</span>
      {line.product.category === 'plan' ? (
        <img alt="" className="review-line__plan-icon" src={reviewIcons.planBadge} />
      ) : null}
      <QuantityStepper
        compact
        label={getLineName(line)}
        max={line.product.maxQuantity}
        min={line.product.minQuantity}
        onDecrement={() => api.decrement(line.product, line.variant?.id)}
        onIncrement={() => api.increment(line.product, line.variant?.id)}
        value={line.quantity}
      />
      <span className="review-line__price">
        {hasDiscount ? <del>{formatCurrency(compareTotal)}</del> : null}
        <strong className={line.product.isFree ? 'review-line__free' : ''}>
          {formatCurrency(currentTotal)}
          {currentTotal > 0 && line.product.priceSuffix ? line.product.priceSuffix : ''}
        </strong>
      </span>
    </li>
  )
}

export function ReviewPanel({ api, copy, onCheckout, onSave }: ReviewPanelProps) {
  const shippingLines = api.reviewLines.filter((line) => line.product.category === 'shipping')
  const savingsMessage = copy.savingsMessage.replace('{amount}', formatCurrency(api.productTotals.savings))

  return (
    <aside className="review-card" aria-label="Review your security system">
      <div className="review-card__main">
        <p className="review-card__eyebrow">Review</p>
        <h2>{copy.title}</h2>
        <p className="review-card__intro">{copy.description}</p>

        <div className="review-groups">
          {reviewGroups.map((group) => {
            const lines = api.reviewLines.filter((line) => line.product.category === group.category)

            if (!lines.length) {
              return null
            }

            return (
              <section className="review-group" key={group.category}>
                <h3>{group.label}</h3>
                <ul>
                  {lines.map((line) => (
                    <ReviewLineItem api={api} key={line.key} line={line} />
                  ))}
                </ul>
              </section>
            )
          })}

          {shippingLines.length ? (
            <section className="review-group review-group--shipping">
              <ul>
                {shippingLines.map((line) => (
                  <li className="review-line review-line--shipping" key={line.key}>
                    <img alt="" className="review-line__thumb" src={reviewIcons.delivery} />
                    <span className="review-line__name">{line.product.name}</span>
                    <span className="review-line__price">
                      {line.product.compareAt ? <del>{formatCurrency(line.product.compareAt)}</del> : null}
                      <strong className="review-line__free">FREE</strong>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>

      <div className="review-card__checkout">
        <div className="guarantee">
          <img alt="Wyze satisfaction guarantee" src={reviewIcons.satisfactionBadge} />
          <div>
            <h3>{copy.guaranteeTitle}</h3>
            <p>{copy.guaranteeCopy}</p>
          </div>
        </div>

        <div className="review-total">
          <span className="review-total__financing">{copy.financingLabel}</span>
          <p>
            <del>{formatCurrency(api.productTotals.compare)}</del>
            <strong>{formatCurrency(api.productTotals.current)}</strong>
          </p>
          <span className="review-total__savings">
            <FiCheckCircle aria-hidden="true" />
            {savingsMessage}
          </span>
        </div>

        <Button className="review-card__checkout-button" onClick={onCheckout}>
          Checkout
        </Button>
        <Button className="review-card__save" onClick={onSave} variant="ghost">
          Save my system for later
        </Button>
      </div>
    </aside>
  )
}
