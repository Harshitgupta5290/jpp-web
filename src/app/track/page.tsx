'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Package, MapPin, Clock, CheckCircle, ArrowRight, Truck } from 'lucide-react'
import PageWrapper from '@/components/layout/PageWrapper'
import Button from '@/components/ui/Button'

const RECENT_EXAMPLES = ['JPP-2024-001', 'JPP-2024-042', 'JPP-2024-108']

const HOW_IT_WORKS = [
  { icon: Package,      label: 'Order Placed',    desc: 'Advance payment received' },
  { icon: CheckCircle,  label: 'Design Approved', desc: 'Artwork verified & sent to press' },
  { icon: Clock,        label: 'Printing',         desc: 'On press, QC in progress' },
  { icon: Truck,        label: 'Dispatched',       desc: 'On the way to you' },
]

const WHATSAPP_URL = `https://wa.me/919999999999?text=${encodeURIComponent('Hi! I want to track my order. My order ID is: ')}`

export default function TrackIndexPage() {
  const router = useRouter()
  const [orderId, setOrderId] = useState('')
  const [error, setError] = useState('')

  const handleTrack = () => {
    const trimmed = orderId.trim()
    if (!trimmed) { setError('Please enter your order ID.'); return }
    setError('')
    router.push(`/track/${encodeURIComponent(trimmed)}`)
  }

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="bg-white border-b border-border">
        <div className="container-page py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-xl mx-auto text-center"
          >
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-6">
              <MapPin size={28} className="text-brand-blue" strokeWidth={1.8} />
            </div>

            <span className="section-label justify-center">Order Tracking</span>
            <h1 className="font-display font-bold text-text-primary mt-1 mb-3">
              Track your{' '}
              <span className="text-gradient-blue">print order.</span>
            </h1>
            <p className="text-text-secondary text-base leading-relaxed mb-8">
              Enter your JPP order ID to see real-time status — from press to your doorstep.
            </p>

            {/* Search box */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
                />
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => { setOrderId(e.target.value); setError('') }}
                  onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                  placeholder="e.g. JPP-2024-001"
                  className={`w-full h-12 pl-10 pr-4 rounded-xl border-2 bg-white text-text-primary placeholder:text-text-tertiary text-sm outline-none transition-all font-mono
                    ${error ? 'border-error focus:border-error' : 'border-border focus:border-brand-blue focus:shadow-[0_0_0_3px_rgba(45,111,255,0.1)]'}`}
                  autoFocus
                />
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={handleTrack}
                icon={<ArrowRight size={17} />}
                iconPosition="right"
                className="h-12 px-6 shrink-0"
              >
                Track Order
              </Button>
            </div>

            {error && (
              <p className="mt-2 text-sm text-error text-left">⚠ {error}</p>
            )}

            {/* Quick examples */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-xs text-text-tertiary">Try example IDs:</span>
              {RECENT_EXAMPLES.map((id) => (
                <button
                  key={id}
                  onClick={() => { setOrderId(id); setError('') }}
                  className="text-xs font-mono px-2.5 py-1 rounded-lg bg-bg-secondary border border-border text-text-secondary hover:border-brand-blue/40 hover:text-brand-blue transition-colors"
                >
                  {id}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How order status works */}
      <section className="bg-bg-secondary py-14">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <h2 className="font-display font-bold text-xl text-text-primary">Order status stages</h2>
            <p className="text-text-secondary text-sm mt-1">Updated every 4 hours · WhatsApp alerts on each stage</p>
          </motion.div>

          <div className="relative max-w-3xl mx-auto">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[calc(12.5%+1.5rem)] right-[calc(12.5%+1.5rem)] h-px border-t-2 border-dashed border-border" aria-hidden="true" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {HOW_IT_WORKS.map(({ icon: Icon, label, desc }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white border-2 border-border flex items-center justify-center mb-3 shadow-soft relative">
                    <Icon size={22} className="text-brand-blue" strokeWidth={1.8} />
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-brand-blue text-white text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-text-primary">{label}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Can't find order */}
      <section className="bg-white py-12">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="max-w-lg mx-auto text-center p-8 rounded-2xl border border-border bg-bg-secondary"
          >
            <p className="font-semibold text-text-primary mb-1">Can&apos;t find your order ID?</p>
            <p className="text-sm text-text-secondary mb-4">
              Your order ID is shared via WhatsApp and email after payment confirmation. It starts with <span className="font-mono font-semibold text-text-primary">JPP-</span>
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 text-sm font-semibold hover:bg-[#25D366]/20 transition-colors"
            >
              Ask us on WhatsApp
            </a>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  )
}
