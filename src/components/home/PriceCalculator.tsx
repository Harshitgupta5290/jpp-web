'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, TrendingDown, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils/formatters'

// Static slabs for homepage demo — real data comes from DB on product pages
const PRODUCTS = [
  {
    id: 'business-cards',
    name: 'Business Cards',
    unit: 'cards',
    slabs: [
      { min: 100, max: 499, price: 3.99 },
      { min: 500, max: 999, price: 2.99 },
      { min: 1000, max: 4999, price: 1.99 },
      { min: 5000, max: null, price: 1.49 },
    ],
  },
  {
    id: 'brochures',
    name: 'Brochures (A4)',
    unit: 'pieces',
    slabs: [
      { min: 100, max: 499, price: 8.0 },
      { min: 500, max: 999, price: 5.5 },
      { min: 1000, max: 4999, price: 3.99 },
      { min: 5000, max: null, price: 2.99 },
    ],
  },
  {
    id: 'letterheads',
    name: 'Letterheads (A4)',
    unit: 'sheets',
    slabs: [
      { min: 100, max: 499, price: 4.5 },
      { min: 500, max: 999, price: 3.0 },
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
  const savingsPercent = unitPrice < maxPrice
    ? Math.round(((maxPrice - unitPrice) / maxPrice) * 100)
    : null
  return { unitPrice, total, savings, savingsPercent }
}

// Animated number — rolls like a slot machine when value changes
function AnimatedPrice({ value, className = '' }: { value: number; className?: string }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
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

  const recalculate = useCallback(
    (pid: ProductId, qty: number) => {
      if (qty > 0) setResult(getPrice(pid, qty))
    },
    []
  )

  // Debounce recalculation while typing quantity
  useEffect(() => {
    const t = setTimeout(() => recalculate(productId, quantity), 300)
    return () => clearTimeout(t)
  }, [productId, quantity, recalculate])

  const selectedProduct = PRODUCTS.find((p) => p.id === productId)!

  return (
    <section className="section">
      <div className="container-page">
        <div className="max-w-4xl mx-auto">
          {/* Heading */}
          <motion.div
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-semibold text-brand-blue tracking-[0.25em] uppercase mb-3">
              Instant Pricing
            </p>
            <h2 className="font-display font-bold text-text-primary">
              Know your cost{' '}
              <span className="text-gradient-blue">before you commit.</span>
            </h2>
            <p className="text-text-secondary mt-3">
              No hidden charges. No sales calls. Just transparent bulk pricing.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 24 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="card p-6 md:p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <Calculator size={18} className="text-brand-blue" />
              <span className="text-sm font-medium text-text-primary">Price Calculator</span>
              <span className="text-xs text-text-secondary ml-auto">No login required</span>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left — Inputs */}
              <div className="space-y-5">
                {/* Product selector */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Product
                  </label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value as ProductId)}
                    className="input-base"
                  >
                    {PRODUCTS.map((p) => (
                      <option key={p.id} value={p.id} className="bg-bg-secondary">
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity input */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Quantity ({selectedProduct.unit})
                  </label>
                  <input
                    type="number"
                    min={100}
                    step={100}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value)
                      const n = parseInt(e.target.value, 10)
                      if (!isNaN(n) && n > 0) setQuantity(n)
                    }}
                    className="input-base"
                    placeholder="e.g. 500"
                  />
                </div>

                {/* Quick qty buttons */}
                <div className="flex flex-wrap gap-2">
                  {[100, 250, 500, 1000, 2500, 5000].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setQuantity(q)
                        setInputValue(String(q))
                      }}
                      className={`
                        px-3 py-1.5 rounded-sm text-xs font-medium transition-all
                        ${quantity === q
                          ? 'bg-brand-blue text-white border border-brand-blue'
                          : 'bg-bg-secondary text-text-secondary border border-border hover:border-brand-blue/40 hover:text-text-primary'
                        }
                      `}
                    >
                      {q >= 1000 ? `${q / 1000}K` : q}
                    </button>
                  ))}
                </div>

                {/* Pricing slabs reference */}
                <div className="rounded-md bg-bg-secondary border border-border p-4">
                  <p className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">Bulk Pricing Slabs</p>
                  <div className="space-y-1.5">
                    {selectedProduct.slabs.map((slab) => {
                      const active = quantity >= slab.min && (slab.max === null || quantity <= slab.max)
                      return (
                        <div
                          key={slab.min}
                          className={`flex items-center justify-between text-xs transition-colors ${active ? 'text-text-primary' : 'text-text-secondary'}`}
                        >
                          <span>
                            {slab.min.toLocaleString()}
                            {slab.max ? `–${slab.max.toLocaleString()}` : '+'}
                            {' '}{selectedProduct.unit}
                          </span>
                          <span className={`font-price font-semibold ${active ? 'text-brand-blue' : ''}`}>
                            ₹{slab.price.toFixed(2)}/pc
                            {active && <span className="ml-1.5 text-[10px] font-normal bg-brand-blue/10 px-1.5 py-0.5 rounded text-brand-blue">Active</span>}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Right — Result */}
              <div className="flex flex-col justify-between">
                <div className="card bg-bg-secondary p-6 flex-1 flex flex-col justify-center">
                  <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Total Estimate</p>
                  <div className="font-price font-bold text-4xl text-text-primary overflow-hidden">
                    <AnimatedPrice value={result.total} />
                  </div>
                  <p className="text-sm text-text-secondary mt-1">
                    <span className="font-price">{formatCurrency(result.unitPrice)}</span> per {selectedProduct.unit} × {quantity.toLocaleString()}
                  </p>

                  {result.savings && result.savingsPercent && (
                    <motion.div
                      key={result.savings}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 p-3 rounded-md bg-success/10 border border-success/20 flex items-center gap-2"
                    >
                      <TrendingDown size={16} className="text-success shrink-0" />
                      <p className="text-xs text-success">
                        You save <strong className="font-price">{formatCurrency(result.savings)}</strong> ({result.savingsPercent}% off) with bulk pricing
                      </p>
                    </motion.div>
                  )}

                  <div className="mt-4 pt-4 border-t border-border space-y-2">
                    <div className="flex justify-between text-xs text-text-secondary">
                      <span>Advance (50%)</span>
                      <span className="font-price text-text-primary">{formatCurrency(Math.ceil(result.total * 0.5))}</span>
                    </div>
                    <div className="flex justify-between text-xs text-text-secondary">
                      <span>Balance on delivery</span>
                      <span className="font-price text-text-primary">{formatCurrency(result.total - Math.ceil(result.total * 0.5))}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <Link href={`/catalog/${productId}`}>
                    <Button variant="primary" fullWidth size="md" icon={<ArrowRight size={16} />} iconPosition="right">
                      Place This Order
                    </Button>
                  </Link>
                  <Link href="/order/custom">
                    <Button variant="ghost" fullWidth size="md">
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
