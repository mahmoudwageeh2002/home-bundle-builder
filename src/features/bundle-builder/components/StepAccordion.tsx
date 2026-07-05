import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { Button } from '../../../shared/components/Button/Button'
import { stepIcons } from '../data/icons'
import type { BundleProduct, BundleStep, StepId } from '../types/bundle'
import { ProductCard } from './ProductCard'
import type { useBundleBuilder } from '../hooks/useBundleBuilder'

type BuilderApi = ReturnType<typeof useBundleBuilder>

type StepAccordionProps = {
  api: BuilderApi
  onStepChange: (stepId: StepId) => void
  openStep: StepId
  products: BundleProduct[]
  steps: BundleStep[]
}

export function StepAccordion({ api, onStepChange, openStep, products, steps }: StepAccordionProps) {
  return (
    <div className="steps" aria-label="Bundle builder steps">
      {steps.map((step, index) => {
        const isOpen = step.id === openStep
        const stepProducts = products.filter((product) => product.stepId === step.id)
        const selectedCount = api.getStepSelectedCount(step.id)
        const nextStep = steps[index + 1]

        return (
          <section className={`step ${isOpen ? 'step--open' : ''}`.trim()} key={step.id}>
            <button className="step__header" onClick={() => onStepChange(step.id)} type="button">
              <span className="step__eyebrow">STEP {index + 1} OF {steps.length}</span>
              <span className="step__title-row">
                <img alt="" className="step__icon" src={stepIcons[step.icon]} />
                <span className="step__title">{step.title}</span>
                <span className="step__status">
                  {selectedCount > 0 ? `${selectedCount} selected` : ''}
                  {isOpen ? <FiChevronUp aria-hidden="true" /> : <FiChevronDown aria-hidden="true" />}
                </span>
              </span>
            </button>

            {isOpen ? (
              <div className="step__body">
                <div className="product-grid">
                  {stepProducts.map((product) => {
                    const activeVariant = api.getActiveVariant(product)
                    const quantity = api.getProductQuantity(product, activeVariant?.id)

                    return (
                      <ProductCard
                        activeVariant={activeVariant}
                        key={product.id}
                        onDecrement={() => api.decrement(product, activeVariant?.id)}
                        onIncrement={() => api.increment(product, activeVariant?.id)}
                        onVariantChange={(variantId) => api.setActiveVariant(product.id, variantId)}
                        product={product}
                        quantity={quantity}
                      />
                    )
                  })}
                </div>

                <div className="step__next">
                  <Button onClick={() => onStepChange(nextStep?.id ?? step.id)} variant="outline">
                    {step.nextLabel}
                  </Button>
                </div>
              </div>
            ) : null}
          </section>
        )
      })}
    </div>
  )
}
