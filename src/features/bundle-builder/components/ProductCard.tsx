import { QuantityStepper } from '../../../shared/components/QuantityStepper/QuantityStepper'
import type { BundleProduct, ProductVariant } from '../types/bundle'
import { formatCurrency } from '../utils'

type ProductCardProps = {
  product: BundleProduct
  activeVariant?: ProductVariant
  quantity: number
  onVariantChange: (variantId: string) => void
  onIncrement: () => void
  onDecrement: () => void
}

export function ProductCard({
  activeVariant,
  onDecrement,
  onIncrement,
  onVariantChange,
  product,
  quantity,
}: ProductCardProps) {
  const isSelected = quantity > 0

  return (
    <article className={`product-card ${isSelected ? 'product-card--selected' : ''}`.trim()}>
      {product.badge ? <span className="product-card__badge">{product.badge}</span> : null}

      <div className="product-card__media">
        <img alt="" src={product.image} />
      </div>

      <div className="product-card__content">
        <h3>{product.name}</h3>
        <p>
          {product.description}{' '}
          {product.learnMoreUrl ? (
            <a href={product.learnMoreUrl} rel="noreferrer" target="_blank">
              Learn More
            </a>
          ) : null}
        </p>

        {product.variants?.length ? (
          <div aria-label={`${product.name} variants`} className="variant-list">
            {product.variants.map((variant) => (
              <button
                aria-pressed={activeVariant?.id === variant.id}
                className={`variant-chip ${
                  activeVariant?.id === variant.id ? 'variant-chip--active' : ''
                }`.trim()}
                key={variant.id}
                onClick={() => onVariantChange(variant.id)}
                type="button"
              >
                <img alt="" src={variant.swatch} />
                <span>{variant.label}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="product-card__footer">
        <QuantityStepper
          label={product.name}
          max={product.maxQuantity}
          min={product.minQuantity}
          onDecrement={onDecrement}
          onIncrement={onIncrement}
          value={quantity}
        />
        <div className="price-stack">
          {product.compareAt ? <del>{formatCurrency(product.compareAt)}</del> : null}
          <strong className={product.isFree ? 'price-stack__free' : ''}>
            {formatCurrency(product.price)}
            {product.price > 0 && product.priceSuffix ? product.priceSuffix : ''}
          </strong>
        </div>
      </div>
    </article>
  )
}
