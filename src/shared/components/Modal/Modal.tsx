import { useEffect } from 'react'
import { FiCheck, FiCopy, FiX } from 'react-icons/fi'
import { Button } from '../Button/Button'
import './Modal.css'

type ModalProps = {
  isOpen: boolean
  link: string
  onClose: () => void
  onCopy: () => void
  copied: boolean
}

export function SaveLinkModal({ copied, isOpen, link, onClose, onCopy }: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div aria-modal="true" className="modal-backdrop" role="dialog">
      <div className="modal">
        <button aria-label="Close save link modal" className="modal__close" onClick={onClose} type="button">
          <FiX aria-hidden="true" />
        </button>
        <p className="modal__eyebrow">Saved system</p>
        <h2 className="modal__title">Copy your return link</h2>
        <p className="modal__copy">
          This link includes your selected plan, variants, quantities, and add-ons.
        </p>
        <div className="modal__link-row">
          <input aria-label="Saved system link" readOnly value={link} />
          <Button className="modal__copy-button" onClick={onCopy}>
            <FiCopy aria-hidden="true" />
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>
    </div>
  )
}

type CheckoutSuccessModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function CheckoutSuccessModal({ isOpen, onClose }: CheckoutSuccessModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div aria-modal="true" className="modal-backdrop" role="dialog">
      <div className="modal modal--success">
        <button aria-label="Close checkout success modal" className="modal__close" onClick={onClose} type="button">
          <FiX aria-hidden="true" />
        </button>
        <span className="modal__success-icon" aria-hidden="true">
          <FiCheck />
        </span>
        <h2 className="modal__title">Checkout succeeded</h2>
        <p className="modal__copy">Your security system is ready to go.</p>
        <Button className="modal__done-button" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  )
}
