'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, TrendingDown, Info } from 'lucide-react'
import { calculatePrice, getAdvanceAmount, getBalanceAmount } from '@/lib/utils/pricing'
import type { PricingSlab, PriceCalculationResult } from '@/types/product'

interface QuantityPriceCalculatorProps {
  slabs: PricingSlab[]
  basePrice: number | null
  minQuantity: number
  onPriceChange: (result: PriceCalculationResult, quantity: number) => void
}

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -14, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="inline-block"
      >
        {prefix}{typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value.toLocaleString('en-IN')}{suffix}
      </motion.span>
    </AnimatePresence>
  )
}

export default function QuantityPriceCalculator({
  slabs,
  basePrice,
  minQuantity,
  onPriceChange,
}: QuantityPriceCalculatorProps) {
  const [quantity, setQuantity] = useState(minQuantity)
  const [inputStr, setInputStr] = useState(String(minQuantity))
  const [result, setResult] = useState<PriceCalculationResult>(() =>
    calculatePrice(minQuantity, slabs, basePrice)
  )

  const recalc = useCallback(
    (qty: number) => {
      const r = calculatePrice(qty, slabs, basePrice)
      setResult(r)
      onPriceChange(r, qty)
    },
    [slabs, basePrice, onPriceChange]
  )

  useEffect(() => {
    const t = setTimeout(() => {
      const n = parseInt(inputStr, 10)
      if (!isNaN(n) && n >= minQuantity) {
        setQuantity(n)
        recalc(n)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [inputStr, minQuantity, recalc])

  const step = minQuantity <= 10 ? 1 : 100
  const decrement = () => {
    const next = Math.max(minQuantity, quantity - step)
    setQuantity(next)
    setInputStr(String(next))
    recalc(next)
  }
  const increment = () => {
    const next = quantity + step
    setQuantity(next)
    setInputStr(String(next))
    recalc(next)
  }

  const advance = getAdvanceAmount(result.totalPrice)
  const balance = getBalanceAmount(result.totalPrice, advance)

  return (
    <div className="space-y-5">
      {/* Quantity input */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Quantity
          <span className="text-text-secondary font-normal ml-2">(min {minQuantity.toLocaleString()})</span>
        </label>
        <div className="flex items-center gap-0">
          <button
            type="button"
            onClick={decrement}
            disabled={quantity <= minQuantity}
            className="w-10 h-11 flex items-center justify-center bg-bg-secondary border border-border rounded-l-sm text-text-secondary hover:text-text-primary hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={15} />
          </button>
          <input
            type="number"
            min={minQuantity}
            value={inputStr}
            onChange={(e) => setInputStr(e.target.value)}
            className="w-28 h-11 bg-bg-secondary border-y border-border text-center text-text-primary font-price font-semibold text-base focus:outline-none focus:border-brand-blue transition-colors"
            aria-label="Quantity"
          />
          <button
            type="button"
            onClick={increment}
            className="w-10 h-11 flex items-center justify-center bg-bg-secondary border border-border rounded-r-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* Pricing slabs reference */}
      {slabs.length > 0 && (
        <div className="rounded-md bg-bg-secondary border border-border p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Info size={13} className="text-text-secondary" />
            <span className="text-xs text-text-secondary font-medium">Volume pricing</span>
          </div>
          <div className="space-y-1.5">
            {slabs.map((slab) => {
              const active = quantity >= slab.min_qty && (slab.max_qty === null || quantity <= slab.max_qty)
              return (
                <div
                  key={slab.id}
                  className={`flex items-center justify-between text-xs transition-colors duration-200 ${active ? 'text-text-primary' : 'text-text-secondary'}`}
                >
                  <span>
                    {slab.min_qty.toLocaleString()}
                    {slab.max_qty ? `–${slab.max_qty.toLocaleString()}` : '+'}
                  </span>
                  <span className={`font-price font-semibold flex items-center gap-1.5 ${active ? 'text-brand-blue' : ''}`}>
                    ₹{slab.price_per_unit.toFixed(2)}/pc
                    {active && (
                      <span className="text-[10px] bg-brand-blue/10 text-brand-blue px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Price display */}
      <div className="rounded-md border border-border bg-bg-secondary overflow-hidden">
        {/* Total */}
        <div className="p-4 pb-3">
          <p className="text-xs text-text-secondary mb-0.5">Estimated Total</p>
          <div className="font-price font-bold text-3xl text-text-primary overflow-hidden">
            <AnimatedNumber prefix="₹" value={result.totalPrice} />
          </div>
          <p className="text-xs text-text-secondary mt-1">
            ₹{result.unitPrice.toFixed(2)} × {quantity.toLocaleString()} pcs
          </p>
        </div>

        {/* Savings */}
        <AnimatePresence>
          {result.savingsPercent && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mx-4 mb-3 p-2.5 rounded-md bg-success/10 border border-success/20 flex items-center gap-2">
                <TrendingDown size={14} className="text-success shrink-0" />
                <p className="text-xs text-success">
                  Saving{' '}
                  <strong className="font-price">
                    ₹{((slabs[0]?.price_per_unit ?? result.unitPrice) - result.unitPrice).toFixed(2)}
                  </strong>{' '}
                  per piece ({result.savingsPercent}% bulk discount)
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment split */}
        <div className="border-t border-border px-4 py-3 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-text-secondary">Pay now (50% advance)</span>
            <span className="font-price font-semibold text-brand-gold">₹{advance.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-secondary">Pay on delivery (balance)</span>
            <span className="font-price font-semibold text-text-primary">₹{balance.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
