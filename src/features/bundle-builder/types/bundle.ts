export type StepId = 'cameras' | 'plan' | 'sensors' | 'protection'

export type ProductCategory =
  | 'cameras'
  | 'sensors'
  | 'accessories'
  | 'plan'
  | 'shipping'

export type StepIcon = 'camera' | 'plan' | 'sensor' | 'protection'

export type BundleStep = {
  id: StepId
  title: string
  icon: StepIcon
  nextLabel: string
}

export type ProductVariant = {
  id: string
  label: string
  swatch: string
}

export type BundleProduct = {
  id: string
  stepId: StepId
  category: ProductCategory
  name: string
  reviewLabel?: string
  description: string
  learnMoreUrl?: string
  badge?: string
  image: string
  compareAt?: number
  price: number
  priceSuffix?: string
  isFree?: boolean
  minQuantity?: number
  maxQuantity?: number
  variants?: ProductVariant[]
}

export type BundleConfiguration = {
  activeVariants: Record<string, string>
  quantities: Record<string, number>
}

export type BundleReviewCopy = {
  title: string
  description: string
  guaranteeTitle: string
  guaranteeCopy: string
  financingLabel: string
  savingsMessage: string
}

export type BundleCatalog = {
  steps: BundleStep[]
  products: BundleProduct[]
  initialConfiguration: BundleConfiguration
  review: BundleReviewCopy
}

export type ReviewLine = {
  key: string
  product: BundleProduct
  variant?: ProductVariant
  quantity: number
  selectedVariantCount: number
}
