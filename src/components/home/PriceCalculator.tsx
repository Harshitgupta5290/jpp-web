'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, TrendingDown, ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils/formatters'

const PRODUCTS = [
  {
    id: 'business-cards', name: 'Business Cards', unit: 'cards',
    slabs: [
      { min: 100,  max: 499,  price: 3.99 },
      { min: 500,  max: 999,  price: 2.99 },
      { min: 1000, max: 4999, price: 1.99 },
      { min: 5000, max: null, price: 1.49 },
    ],
  },
  {
    id: 'brochures', name: 'Brochures (A4)', unit: 'pieces',
    slabs: [
      { min: 100,  max: 499,  price: 8.0 },
      { min: 500,  max: 999,  price: 5.5 },
      { min: 1000, max: 4999, price: 3.99 },
      { min: 5000, max: null, price: 2.99 },
    ],
  },
  {
    id: 'letterheads', name: 'Letterheads (A4)', unit: 'sheets',
    slabs: [
      { min: 100,  max: 499,  price: 4.5 },
      { min: 500,  max: 999,  price: 3.0 },
      { min: 1000, max: 4999, price: 2.25 },
      { min: 5000, max: null, price: 1.75 },
    ],
  },
] as const

type ProductId = (typeof PRODUCTS)[number]['id']

interface CalcResult {
  unitPrice: number
  total: number
  savings: number | null
  savingsPercent: number | null
}

function getPrice(productId: ProductId, qty: number): CalcResult {
  const product = PRODUCTS.find((p) => p.id === productId)!
  const sorted = [...product.slabs].sort((a, b) => a.min - b.min)
  const slab = sorted.findLast((s) => qty >= s.min) ?? sorted[0]!
  const unitPrice = slab.price
  const total = unitPrice * qty
  const maxPrice = sorted[0]!.price
  const savings = unitPrice < maxPrice ? Math.round((maxPrice - unitPrice) * qty) : null
  const savingsPercent = unitPrice < maxPrice ? Math.round(((maxPrice - unitPrice) / maxPrice) * 100) : null
  return { unitPrice, total, savings, savingsPercent }
}

function AnimatedPrice({ value, className = '' }: { value: number; className?: string }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -16, opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className={`inline-block ${className}`}
      >
        {formatCurrency(value)}
      </motion.span>
    </AnimatePresence>
  )
}

export default function PriceCalculator() {
  const [productId, setProductId] = useState<ProductId>('business-cards')
  const [quantity, setQuantity] = useState(500)
  const [inputValue, setInputValue] = useState('500')
  const [result, setResult] = useState<CalcResult>(() => getPrice('business-cards', 500))

  const recalculate = useCallback((pid: ProductId, qty: number) => {
    if (qty > 0) setResult(getPrice(pid, qty))
  }, [])

  useEffect(() => {
    const t = setTimeout(() => recalculate(productId, quantity), 300)
    return () => clearTimeout(t)
  }, [productId, quantity, recalculate])

  const selectedProduct = PRODUCTS.find((p) => p.id === productId)!

  return (
    <section className="section bg-bg-secondary">
      <div className="container-page">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <span className="section-label">Instant Pricing</span>
            <h2 className="font-display font-bold text-text-primary">
              Know your cost{' '}
              <span className="text-gradient-blue">before you commit.</span>
            </h2>
            <p className="text-text-secondary mt-3">
              No hidden charges. No sales calls. Just transparent bulk pricing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border border-border shadow-soft p-6 md:p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Calculator size={16} className="text-brand-blue" />
              </div>
              <span className="text-sm font-semibold text-text-primary">Price Calculator</span>
              <span className="text-xs text-text-tertiary ml-auto flex items-center gap-1">
                <Zap size={11} className="text-success" /> No login required
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left — Inputs */}
              <div className="space-y-5">
                {/* Product selector */}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Product</label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value as ProductId)}
                    className="input-base"
                  >
                    {PRODUCTS.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Quantity input */}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">
                    Quantity ({selectedProduct.unit})
                  </label>
                  <input
                    type="number" min={100} step={100} value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value)
                      const n = parseInt(e.target.value, 10)
                      if (!isNaN(n) && n > 0) setQuantity(n)
                    }}
                    className="input-base" placeholder="e.g. 500"
                  />
                </div>

                {/* Quick qty buttons */}
                <div className="flex flex-wrap gap-2">
                  {[100, 250, 500, 1000, 2500, 5000].map((q) => (
                    <button
                      key={q}
                      onClick={() => { setQuantity(q); setInputValue(String(q)) }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        quantity === q
                          ? 'bg-brand-blue text-white border-brand-blue shadow-glow-sm'
                          : 'bg-white text-text-secondary border-border hover:border-brand-blue/40 hover:text-brand-blue'
                      }`}
                    >
                      {q >= 1000 ? `${q / 1000}K` : q}
                    </button>
                  ))}
                </div>

                {/* Pricing slabs */}
                <div className="rounded-xl bg-bg-secondary border border-border p-4">
                  <p className="text-xs font-bold text-text-secondary mb-3 uppercase tracking-wide">Bulk Pricing Slabs</p>
                  <div className="space-y-2">
                    {selectedProduct.slabs.map((slab) => {
                      const active = quantity >= slab.min && (slab.max === null || quantity <= slab.max)
                      return (
                        <div key={slab.min} className={`flex items-center justify-between text-xs transition-all px-2 py-1.5 rounded-lg ${active ? 'bg-blue-50 border border-blue-100' : ''}`}>
                          <span className={active ? 'text-text-primary font-medium' : 'text-text-secondary'}>
                            {slab.min.toLocaleString()}{slab.max ? `–${slab.max.toLocaleString()}` : '+'} {selectedProduct.unit}
                          </span>
                          <span className={`font-price font-semibold ${active ? 'text-brand-blue' : 'text-text-secondary'}`}>
                            ₹{slab.price.toFixed(2)}/pc
                            {active && <span className="ml-1.5 text-[9px] bg-brand-blue text-white px-1.5 py-0.5 rounded font-normal">Active</span>}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Right — Result */}
              <div className="flex flex-col gap-4">
                {/* Total */}
                <div className="flex-1 rounded-xl bg-gradient-to-br from-blue-50 to-bg-secondary border border-blue-100 p-6 flex flex-col justify-center">
                  <p className="text-xs text-text-secondary uppercase tracking-wide font-semibold mb-1">Total Estimate</p>
                  <div className="font-price font-bold text-4xl text-text-primary overflow-hidden">
                    <AnimatedPrice value={result.total} />
                  </div>
                  <p className="text-sm text-text-secondary mt-1">
                    <span className="font-price font-medium text-text-primary">{formatCurrency(result.unitPrice)}</span>
                    {' '}per {selectedProduct.unit} × {quantity.toLocaleString()}
                  </p>

                  {result.savings && result.savingsPercent && (
                    <motion.div
                      key={result.savings}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 p-3 rounded-xl bg-success/10 border border-success/20 flex items-center gap-2"
                    >
                      <TrendingDown size={15} className="text-success shrink-0" />
                      <p className="text-xs text-success">
                        You save <strong className="font-price">{formatCurrency(result.savings)}</strong> ({result.savingsPercent}% off) with bulk pricing
                      </p>
                    </motion.div>
                  )}

                  <div className="mt-4 pt-4 border-t border-border space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-text-secondary">Advance (50%)</span>
                      <span className="font-price font-semibold text-text-primary">{formatCurrency(Math.ceil(result.total * 0.5))}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-secondary">Balance on delivery</span>
                      <span className="font-price font-semibold text-text-primary">{formatCurrency(result.total - Math.ceil(result.total * 0.5))}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link href={`/catalog/${productId}`}>
                    <Button variant="primary" fullWidth size="md" icon={<ArrowRight size={16} />} iconPosition="right">
                      Place This Order
                    </Button>
                  </Link>
                  <Link href="/order/custom">
                    <Button variant="secondary" fullWidth size="md">
                      Need something custom?
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
