import { formatCurrency } from '@/lib/utils/formatters'
import { getAdvanceAmount, getBalanceAmount } from '@/lib/utils/pricing'

interface OrderSummaryProps {
  subtotal: number
  showPaymentSplit?: boolean
  actionSlot?: React.ReactNode
  className?: string
}

export default function OrderSummary({
  subtotal,
  showPaymentSplit = false,
  actionSlot,
  className = '',
}: OrderSummaryProps) {
  const tax = 0 // GST handled separately for B2B
  const total = subtotal + tax
  const advance = getAdvanceAmount(total)
  const balance = getBalanceAmount(total, advance)

  return (
    <div className={`card p-5 space-y-4 ${className}`}>
      <h2 className="font-display font-semibold text-base text-text-primary">Order Summary</h2>

      <div className="space-y-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Subtotal</span>
          <span className="font-price text-text-primary">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">GST / Tax</span>
          <span className="text-text-secondary text-xs font-medium">Included</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Delivery</span>
          <span className="text-success text-xs font-semibold">FREE</span>
        </div>
      </div>

      <div className="border-t border-border pt-3 flex justify-between">
        <span className="font-semibold text-text-primary">Total</span>
        <span className="font-price font-bold text-xl text-text-primary">{formatCurrency(total)}</span>
      </div>

      {showPaymentSplit && (
        <div className="rounded-md bg-bg-secondary border border-border p-3 space-y-2">
          <p className="text-xs font-semibold text-text-primary">Payment Schedule</p>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Pay now (50% advance)</span>
            <span className="font-price font-bold text-brand-gold">{formatCurrency(advance)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Pay on delivery</span>
            <span className="font-price font-semibold text-text-primary">{formatCurrency(balance)}</span>
          </div>
        </div>
      )}

      {actionSlot && <div>{actionSlot}</div>}
    </div>
  )
}
