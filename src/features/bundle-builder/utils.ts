import type {
  BundleCatalog,
  BundleConfiguration,
  BundleProduct,
  ProductVariant,
  ReviewLine,
  StepId,
} from './types/bundle'

export const STORAGE_KEY = 'home-bundle-builder:configuration'

export function getDefaultVariantId(product: BundleProduct) {
  return product.variants?.[0]?.id ?? 'default'
}

export function getSelectionKey(productId: string, variantId = 'default') {
  return `${productId}:${variantId}`
}

export function getVariantFromKey(key: string) {
  const [, variantId] = key.split(':')
  return variantId === 'default' ? undefined : variantId
}

export function clampQuantity(product: BundleProduct, quantity: number) {
  const min = product.minQuantity ?? 0
  const max = product.maxQuantity ?? 99
  return Math.min(max, Math.max(min, quantity))
}

export function getStoredConfiguration() {
  const value = window.localStorage.getItem(STORAGE_KEY)

  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as BundleConfiguration
  } catch {
    return null
  }
}

export function storeConfiguration(configuration: BundleConfiguration) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(configuration))
}

export function normalizeConfiguration(
  catalog: BundleCatalog,
  configuration: BundleConfiguration,
) {
  const productsById = new Map(catalog.products.map((product) => [product.id, product]))
  const activeVariants = { ...configuration.activeVariants }
  const quantities: Record<string, number> = {}

  for (const product of catalog.products) {
    if (product.variants?.length && !activeVariants[product.id]) {
      activeVariants[product.id] = getDefaultVariantId(product)
    }

    if ((product.minQuantity ?? 0) > 0) {
      const key = getSelectionKey(product.id)
      quantities[key] = product.minQuantity ?? 0
    }
  }

  for (const [key, rawQuantity] of Object.entries(configuration.quantities)) {
    const [productId, variantId = 'default'] = key.split(':')
    const product = productsById.get(productId)

    if (!product) {
      continue
    }

    const hasVariant = product.variants?.some((variant) => variant.id === variantId)
    const normalizedVariant = product.variants?.length ? variantId : 'default'

    if (product.variants?.length && !hasVariant) {
      continue
    }

    quantities[getSelectionKey(productId, normalizedVariant)] = clampQuantity(
      product,
      Number(rawQuantity) || 0,
    )
  }

  return { activeVariants, quantities }
}

export function formatCurrency(value: number) {
  if (value === 0) {
    return 'FREE'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

export function getProductVariant(product: BundleProduct, variantId?: string) {
  return product.variants?.find((variant) => variant.id === variantId)
}

export function getProductQuantity(
  quantities: BundleConfiguration['quantities'],
  product: BundleProduct,
  variantId?: string,
) {
  return quantities[getSelectionKey(product.id, variantId)] ?? 0
}

export function getReviewLines(
  products: BundleProduct[],
  quantities: BundleConfiguration['quantities'],
) {
  const selectedVariantCounts = new Map<string, number>()

  for (const [key, quantity] of Object.entries(quantities)) {
    if (quantity > 0) {
      const [productId] = key.split(':')
      selectedVariantCounts.set(productId, (selectedVariantCounts.get(productId) ?? 0) + 1)
    }
  }

  return products.flatMap((product) => {
    const variantIds = product.variants?.map((variant) => variant.id) ?? ['default']

    return variantIds
      .map((variantId) => {
        const key = getSelectionKey(product.id, variantId)
        const quantity = quantities[key] ?? 0
        const variant = product.variants?.find((item) => item.id === variantId)

        return {
          key,
          product,
          variant,
          quantity,
          selectedVariantCount: selectedVariantCounts.get(product.id) ?? 0,
        }
      })
      .filter((line) => line.quantity > 0)
  }) as ReviewLine[]
}

export function getSelectedProductCount(
  products: BundleProduct[],
  stepId: StepId,
  quantities: BundleConfiguration['quantities'],
) {
  return products.filter((product) => {
    if (product.stepId !== stepId) {
      return false
    }

    const variants: (ProductVariant | undefined)[] = product.variants ?? [undefined]
    return variants.some((variant) => getProductQuantity(quantities, product, variant?.id) > 0)
  }).length
}

export function getLineCurrentTotal(line: ReviewLine) {
  return line.product.price * line.quantity
}

export function getLineCompareTotal(line: ReviewLine) {
  return (line.product.compareAt ?? line.product.price) * line.quantity
}
