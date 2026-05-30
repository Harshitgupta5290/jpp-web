'use client'

import { motion } from 'framer-motion'
import { Trash2, Layers, FileText } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatters'
import { useCartStore } from '@/store/cartStore'
import type { CartItem as CartItemType } from '@/types/product'

interface CartItemProps {
  item: CartItemType
}

export default function CartItemCard({ item }: CartItemProps) {
  const { removeItem } = useCartStore()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="card p-4 flex gap-4"
    >
      {/* Product icon */}
      <div className="w-14 h-14 rounded-md bg-bg-secondary border border-border flex items-center justify-center shrink-0">
        <Layers size={22} className="text-brand-blue" strokeWidth={1.8} />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-text-primary leading-snug">{item.product.name}</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Qty: <span className="font-price font-medium text-text-primary">{item.quantity.toLocaleString()}</span>
              {' · '}
              {formatCurrency(item.unitPrice)}/pc
            </p>
          </div>
          <p className="font-price font-bold text-text-primary text-base shrink-0">
            {formatCurrency(item.totalPrice)}
          </p>
        </div>

        {/* Specs */}
        {Object.keys(item.specifications).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {Object.entries(item.specifications).map(([key, val]) => (
              <span key={key} className="text-[11px] px-2 py-0.5 rounded bg-bg-secondary text-text-secondary border border-border">
                {val}
              </span>
            ))}
          </div>
        )}

        {/* Design file indicator */}
        {item.designFileUrl && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-success">
            <FileText size={12} />
            Design file uploaded
          </div>
        )}
        {item.needsDesign && !item.designFileUrl && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-brand-gold">
            <FileText size={12} />
            Design assistance requested
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/60">
          <button
            onClick={() => removeItem(item.id)}
            className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-error transition-colors"
          >
            <Trash2 size={13} />
            Remove
          </button>
        </div>
      </div>
    </motion.div>
  )
}
