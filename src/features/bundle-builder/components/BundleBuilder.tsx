import { useEffect, useRef, useState } from 'react'
import { CheckoutSuccessModal, SaveLinkModal } from '../../../shared/components/Modal/Modal'
import { getBundleCatalog } from '../services/catalogService'
import type { BundleCatalog, StepId } from '../types/bundle'
import { useBundleBuilder } from '../hooks/useBundleBuilder'
import { ReviewPanel } from './ReviewPanel'
import { StepAccordion } from './StepAccordion'

function BundleBuilderLoaded({ catalog }: { catalog: BundleCatalog }) {
  const [openStep, setOpenStep] = useState<StepId>('cameras')
  const [shareLink, setShareLink] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isReviewHighlighted, setIsReviewHighlighted] = useState(false)
  const reviewRef = useRef<HTMLDivElement>(null)
  const highlightTimeoutRef = useRef<number | null>(null)
  const api = useBundleBuilder(catalog)

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current)
      }
    }
  }, [])

  function handleSave() {
    setCopied(false)
    setShareLink(api.saveConfiguration())
    setIsModalOpen(true)
  }

  async function handleCopy() {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      return
    }

    setCopied(true)
  }

  function handleReviewRequest() {
    reviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setIsReviewHighlighted(false)

    window.requestAnimationFrame(() => {
      setIsReviewHighlighted(true)
    })

    if (highlightTimeoutRef.current) {
      window.clearTimeout(highlightTimeoutRef.current)
    }

    highlightTimeoutRef.current = window.setTimeout(() => {
      setIsReviewHighlighted(false)
    }, 1400)
  }

  return (
    <>
      <main className="bundle-page">
        <h1>Let's get started!</h1>
        <div className="bundle-layout">
          <div className="bundle-layout__builder">
            <StepAccordion
              api={api}
              onReview={handleReviewRequest}
              onStepChange={setOpenStep}
              openStep={openStep}
              products={catalog.products}
              steps={catalog.steps}
            />
          </div>
          <div
            className={`bundle-layout__review ${
              isReviewHighlighted ? 'bundle-layout__review--highlight' : ''
            }`.trim()}
            ref={reviewRef}
          >
            <ReviewPanel
              api={api}
              copy={catalog.review}
              onCheckout={() => setIsCheckoutModalOpen(true)}
              onSave={handleSave}
            />
          </div>
        </div>
      </main>
      <CheckoutSuccessModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
      <SaveLinkModal
        copied={copied}
        isOpen={isModalOpen}
        link={shareLink}
        onClose={() => setIsModalOpen(false)}
        onCopy={handleCopy}
      />
    </>
  )
}

export function BundleBuilder() {
  const [catalog, setCatalog] = useState<BundleCatalog | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getBundleCatalog()
      .then(setCatalog)
      .catch(() => setError('We could not load the bundle catalog.'))
  }, [])

  if (error) {
    return <main className="bundle-status">{error}</main>
  }

  if (!catalog) {
    return <main className="bundle-status">Loading your bundle builder...</main>
  }

  return <BundleBuilderLoaded catalog={catalog} />
}
