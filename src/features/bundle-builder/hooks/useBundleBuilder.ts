import { useMemo, useState } from 'react'
import type { BundleCatalog, BundleConfiguration, BundleProduct } from '../types/bundle'
import { getConfigurationFromUrl, getShareUrl } from '../services/configurationUrl'
import {
  clampQuantity,
  getDefaultVariantId,
  getProductQuantity,
  getReviewLines,
  getSelectedProductCount,
  getSelectionKey,
  getStoredConfiguration,
  getLineCompareTotal,
  getLineCurrentTotal,
  normalizeConfiguration,
  storeConfiguration,
} from '../utils'

function getInitialConfiguration(catalog: BundleCatalog) {
  return normalizeConfiguration(
    catalog,
    getConfigurationFromUrl() ?? getStoredConfiguration() ?? catalog.initialConfiguration,
  )
}

export function useBundleBuilder(catalog: BundleCatalog) {
  const [configuration, setConfiguration] = useState<BundleConfiguration>(() =>
    getInitialConfiguration(catalog),
  )

  const productsById = useMemo(
    () => new Map(catalog.products.map((product) => [product.id, product])),
    [catalog.products],
  )

  const reviewLines = useMemo(
    () => getReviewLines(catalog.products, configuration.quantities),
    [catalog.products, configuration.quantities],
  )

  const productTotals = useMemo(() => {
    const payableLines = reviewLines.filter((line) => line.product.category !== 'shipping')
    const current = payableLines.reduce((sum, line) => sum + getLineCurrentTotal(line), 0)
    const compare = payableLines.reduce((sum, line) => sum + getLineCompareTotal(line), 0)

    return {
      current,
      compare,
      savings: Math.max(compare - current, 0),
    }
  }, [reviewLines])

  function setActiveVariant(productId: string, variantId: string) {
    setConfiguration((current) => ({
      ...current,
      activeVariants: {
        ...current.activeVariants,
        [productId]: variantId,
      },
    }))
  }

  function setQuantity(product: BundleProduct, variantId: string | undefined, quantity: number) {
    const key = getSelectionKey(product.id, variantId)
    const nextQuantity = clampQuantity(product, quantity)

    setConfiguration((current) => ({
      ...current,
      quantities: {
        ...current.quantities,
        [key]: nextQuantity,
      },
    }))
  }

  function increment(product: BundleProduct, variantId?: string) {
    setQuantity(product, variantId, getProductQuantity(configuration.quantities, product, variantId) + 1)
  }

  function decrement(product: BundleProduct, variantId?: string) {
    setQuantity(product, variantId, getProductQuantity(configuration.quantities, product, variantId) - 1)
  }

  function getActiveVariant(product: BundleProduct) {
    return product.variants?.find(
      (variant) => variant.id === (configuration.activeVariants[product.id] ?? getDefaultVariantId(product)),
    )
  }

  function getStepSelectedCount(stepId: Parameters<typeof getSelectedProductCount>[1]) {
    return getSelectedProductCount(catalog.products, stepId, configuration.quantities)
  }

  function saveConfiguration() {
    const normalized = normalizeConfiguration(catalog, configuration)
    storeConfiguration(normalized)
    setConfiguration(normalized)
    return getShareUrl(normalized)
  }

  return {
    activeVariants: configuration.activeVariants,
    configuration,
    decrement,
    getActiveVariant,
    getProductQuantity: (product: BundleProduct, variantId?: string) =>
      getProductQuantity(configuration.quantities, product, variantId),
    getStepSelectedCount,
    increment,
    productsById,
    productTotals,
    reviewLines,
    saveConfiguration,
    setActiveVariant,
    setQuantity,
  }
}
