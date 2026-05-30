'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
  children: React.ReactNode
  footer?: React.ReactNode
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-full m-0 h-dvh rounded-none',
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  children,
  footer,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={closeOnBackdrop ? onClose : undefined}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              key="modal-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
              className={`
                relative w-full bg-bg-card border border-border
                rounded-t-xl sm:rounded-xl shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_24px_80px_rgba(0,0,0,0.7)]
                max-h-[90dvh] overflow-hidden flex flex-col
                ${sizeStyles[size]}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-start justify-between p-5 pb-4 border-b border-border shrink-0">
                  <div>
                    {title && (
                      <h2
                        id="modal-title"
                        className="font-display font-semibold text-text-primary text-lg leading-tight"
                      >
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p className="text-sm text-text-secondary mt-1">{description}</p>
                    )}
                  </div>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="touch-target text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-md transition-colors ml-4 -mr-1 -mt-1 shrink-0"
                      aria-label="Close modal"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              )}

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5">{children}</div>

              {/* Footer */}
              {footer && (
                <div className="shrink-0 p-5 pt-4 border-t border-border">{footer}</div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
