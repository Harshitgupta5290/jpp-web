'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'

const icons = {
  success: <CheckCircle2 size={18} className="text-success shrink-0" />,
  error: <XCircle size={18} className="text-error shrink-0" />,
  warning: <AlertCircle size={18} className="text-[#F59E0B] shrink-0" />,
  info: <Info size={18} className="text-brand-blue shrink-0" />,
}

const borderColors = {
  success: 'border-l-success',
  error: 'border-l-error',
  warning: 'border-l-[#F59E0B]',
  info: 'border-l-brand-blue',
}

export default function ToastContainer() {
  const { toasts, removeToast } = useUIStore()

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 48, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 48, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.1 }}
            className={`
              pointer-events-auto
              flex items-start gap-3 p-4
              bg-bg-card border border-border border-l-2 ${borderColors[toast.type]}
              rounded-md shadow-card
            `}
            role="alert"
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary leading-snug">
                {toast.title}
              </p>
              {toast.message && (
                <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="touch-target text-text-secondary hover:text-text-primary transition-colors -mt-0.5 -mr-0.5 shrink-0"
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
