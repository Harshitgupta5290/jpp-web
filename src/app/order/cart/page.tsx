'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react'
import PageWrapper from '@/components/layout/PageWrapper'
import CartItemCard from '@/components/order/CartItem'
import OrderSummary from '@/components/order/OrderSummary'
import Button from '@/components/ui/Button'
import { useCartStore } from '@/store/cartStore'

export default function CartPage() {
  const { items, totalPrice, clearCart } = useCartStore()
  const total = totalPrice()

  return (
    <PageWrapper>
      <div className="container-page py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShoppingCart size={22} className="text-brand-blue" />
            <h1 className="font-display font-bold text-2xl text-text-primary">
              Your Cart
            </h1>
            {items.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-brand-blue/15 text-brand-blue text-xs font-semibold border border-brand-blue/30">
                {items.length} item{items.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <Link href="/catalog" className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors">
            <ArrowLeft size={15} />
            Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-bg-card border border-border flex items-center justify-center mx-auto mb-5">
              <ShoppingBag size={32} className="text-text-secondary" strokeWidth={1.5} />
            </div>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-2">Your cart is empty</h2>
            <p className="text-text-secondary mb-6 max-w-sm mx-auto">
              Browse our catalog and add products to get started.
            </p>
            <Link href="/catalog">
              <Button variant="primary" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
                Browse Products
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left — Items */}
            <div className="lg:col-span-2 space-y-3">
              <AnimatePresence>
                {items.map((item) => (
                  <CartItemCard key={item.id} item={item} />
                ))}
              </AnimatePresence>

              {/* Clear cart */}
              <div className="pt-2">
                <button
                  onClick={clearCart}
                  className="text-xs text-text-secondary hover:text-error transition-colors"
                >
                  Clear all items
                </button>
              </div>
            </div>

            {/* Right — Summary */}
            <div className="space-y-4">
              <OrderSummary
                subtotal={total}
                showPaymentSplit
                actionSlot={
                  <Link href="/order/checkout">
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      icon={<ArrowRight size={18} />}
                      iconPosition="right"
                    >
                      Proceed to Checkout
                    </Button>
                  </Link>
                }
              />

              {/* Trust indicators */}
              <div className="card p-4 space-y-2">
                {[
                  '🔒 Secure payment via Razorpay',
                  '🚚 Free pan-India delivery',
                  '✅ Quality guaranteed or free reprint',
                ].map((t) => (
                  <p key={t} className="text-xs text-text-secondary">{t}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
