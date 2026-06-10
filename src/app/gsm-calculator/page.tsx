'use client'

import { useState } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import { Calculator, Info, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const PAPER_REFERENCE = [
  { name: 'Tissue / Newsprint', gsm: '40–60', use: 'Newspapers, tissue paper' },
  { name: 'Copy / Bond Paper', gsm: '70–90', use: 'Office printing, photocopies' },
  { name: 'Brochure / Leaflet', gsm: '100–130', use: 'Flyers, brochures' },
  { name: 'Magazine / Catalog', gsm: '130–170', use: 'Magazines, product catalogs' },
  { name: 'Thick Brochure', gsm: '170–250', use: 'Premium brochures, covers' },
  { name: 'Business Card', gsm: '250–350', use: 'Standard business cards' },
  { name: 'Premium Card', gsm: '350–600', use: 'Premium cards, luxury stationery' },
]

export default function GSMCalculatorPage() {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [sheets, setSheets] = useState('')
  const [weight, setWeight] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState('')

  function calculate() {
    const w = parseFloat(width)
    const h = parseFloat(height)
    const n = parseFloat(sheets)
    const wt = parseFloat(weight)

    if (!w || !h || !n || !wt || w <= 0 || h <= 0 || n <= 0 || wt <= 0) {
      setError('Please fill all fields with valid positive values.')
      setResult(null)
      return
    }

    // Convert dimensions to meters
    const factor = unit === 'inches' ? 0.0254 : 0.01
    const widthM = w * factor
    const heightM = h * factor

    // GSM = weight_grams / (area_per_sheet_m2 × num_sheets)
    const weightGrams = wt * 1000
    const totalAreaM2 = widthM * heightM * n
    const gsm = weightGrams / totalAreaM2

    setError('')
    setResult(Math.round(gsm * 100) / 100)
  }

  function reset() {
    setWidth('')
    setHeight('')
    setSheets('')
    setWeight('')
    setResult(null)
    setError('')
  }

  const unitLabel = unit === 'inches' ? 'in' : 'cm'

  return (
    <PageWrapper>
      {/* Hero */}
      <div className="bg-bg-secondary border-b border-border py-10">
        <div className="container-page">
          <div className="text-center">
            <span className="section-label">Free Tool</span>
            <h1 className="font-display font-bold text-text-primary text-3xl sm:text-4xl mt-1">
              Free Paper GSM Calculator Tool
            </h1>
            <p className="text-text-secondary mt-3 max-w-lg mx-auto text-sm leading-relaxed">
              This is a free tool developed by Jawahar Printing Press. Calculate the Grammage
              (GSM) of any paper by entering the sheet dimensions, number of sheets, and total weight below.
            </p>
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-text-tertiary">
              <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link href="/gsm-calculator" className="text-brand-blue font-medium">Paper GSM Calculator</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="section bg-white">
        <div className="container-page">
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 max-w-5xl mx-auto">

            {/* Calculator form */}
            <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-card">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Calculator size={18} className="text-brand-blue" />
                </div>
                <h2 className="font-display font-bold text-lg text-text-primary">Calculate Paper GSM</h2>
              </div>

              {/* Unit */}
              <div className="mb-5">
                <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                  Select Unit <span className="text-error">*</span>
                </label>
                <select
                  value={unit}
                  onChange={(e) => { setUnit(e.target.value as 'inches' | 'cm'); setResult(null) }}
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
                >
                  <option value="inches">Inches</option>
                  <option value="cm">Centimeters</option>
                </select>
              </div>

              {/* Width */}
              <div className="mb-5">
                <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                  Enter Paper Width <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder={`Enter actual width (${unitLabel})`}
                  className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
                />
              </div>

              {/* Height */}
              <div className="mb-5">
                <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                  Enter Paper Height <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder={`Enter actual height (${unitLabel})`}
                  className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
                />
              </div>

              {/* Number of sheets */}
              <div className="mb-5">
                <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                  Number of Sheets (Total Weighed Sheets) <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={sheets}
                  onChange={(e) => setSheets(e.target.value)}
                  placeholder="Enter number of sheets"
                  className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
                />
              </div>

              {/* Weight */}
              <div className="mb-6">
                <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">
                  Weight (in KGs) <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter sheets actual weight"
                  className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
                />
              </div>

              {error && (
                <p className="text-error text-sm mb-4 font-medium">{error}</p>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={calculate}
                  className="flex-1 bg-brand-blue hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 shadow-glow-sm"
                >
                  <Calculator size={17} />
                  Calculate Paper GSM
                </button>
                {result !== null && (
                  <button
                    onClick={reset}
                    className="px-4 rounded-xl border border-border text-text-secondary hover:bg-bg-secondary text-sm font-medium transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Result */}
              {result !== null && (
                <div className="mt-6 rounded-xl border-2 border-brand-blue/20 bg-blue-50 p-5 text-center">
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-2">
                    Calculated GSM
                  </p>
                  <p className="font-price text-5xl font-bold text-brand-blue leading-none">
                    {result}
                  </p>
                  <p className="text-xs text-text-secondary mt-2">grams per square meter (g/m²)</p>
                  {/* Show matching paper type */}
                  {(() => {
                    const match = PAPER_REFERENCE.find(({ gsm }) => {
                      const [lo, hi] = gsm.split('–').map(Number)
                      return result >= lo && result <= hi
                    })
                    return match ? (
                      <p className="mt-3 text-sm font-semibold text-brand-blue">
                        ≈ {match.name} <span className="font-normal text-text-secondary">({match.use})</span>
                      </p>
                    ) : null
                  })()}
                </div>
              )}

              {/* Formula note */}
              <div className="mt-5 p-3.5 rounded-xl bg-bg-secondary border border-border">
                <p className="text-[11px] text-text-tertiary leading-relaxed">
                  <strong className="text-text-secondary">Formula:</strong>{' '}
                  GSM = (Weight in grams) ÷ (Width × Height × Sheets) where dimensions are in metres.
                </p>
              </div>
            </div>

            {/* Reference table */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-card">
                <div className="px-5 py-4 bg-bg-secondary border-b border-border flex items-center gap-2">
                  <Info size={15} className="text-brand-blue shrink-0" />
                  <h3 className="font-display font-bold text-sm text-text-primary">
                    Paper Type Reference
                  </h3>
                </div>
                <div className="divide-y divide-border">
                  {PAPER_REFERENCE.map(({ name, gsm, use }) => (
                    <div key={name} className="px-5 py-3.5">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-medium text-text-primary">{name}</span>
                        <span className="font-price text-sm font-bold text-brand-blue whitespace-nowrap ml-2">
                          {gsm} GSM
                        </span>
                      </div>
                      <p className="text-[11px] text-text-tertiary">{use}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA to order */}
              <div className="rounded-2xl border border-brand-blue/20 bg-blue-50 p-5 text-center">
                <p className="font-display font-bold text-text-primary text-sm mb-1">
                  Ready to print?
                </p>
                <p className="text-xs text-text-secondary mb-3">
                  Now that you know your paper GSM, get an instant price quote for your order.
                </p>
                <Link
                  href="/#price-calculator"
                  className="inline-flex items-center gap-1.5 bg-brand-blue text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Calculator size={13} />
                  Get Bulk Price Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
