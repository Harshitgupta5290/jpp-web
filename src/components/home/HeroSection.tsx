'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Star, CheckCircle, TrendingUp, Printer } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useHasMounted } from '@/hooks/useHasMounted'

// ─── Product Mockup Cards ─────────────────────────────────────────────────────

function BusinessCardMockup() {
  return (
    <div className="relative w-48 h-28 rounded-xl overflow-hidden shadow-large border border-white/80" style={{ background: 'linear-gradient(135deg, #1a3a6b 0%, #2D6FFF 100%)' }}>
      <div className="absolute inset-0 bg-dots-dark opacity-30" />
      <div className="absolute bottom-3 left-4 right-4">
        <div className="h-2.5 w-24 bg-white/80 rounded mb-1.5" />
        <div className="h-1.5 w-16 bg-white/40 rounded mb-1" />
        <div className="h-1.5 w-20 bg-white/40 rounded" />
      </div>
      <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
        <div className="w-4 h-4 rounded bg-white/60" />
      </div>
      <span className="absolute top-2 left-3 text-[8px] text-white/60 font-mono uppercase tracking-wider">Business Card</span>
    </div>
  )
}

function BrochureMockup() {
  return (
    <div className="relative w-36 h-48 rounded-xl overflow-hidden shadow-large border border-white/80" style={{ background: 'linear-gradient(160deg, #f8f9fb 0%, #e8eef8 100%)' }}>
      <div className="h-16 w-full" style={{ background: 'linear-gradient(135deg, #F5A500 0%, #ff6b35 100%)' }} />
      <div className="p-3 space-y-1.5">
        <div className="h-2 w-full bg-gray-200 rounded" />
        <div className="h-2 w-4/5 bg-gray-200 rounded" />
        <div className="h-2 w-3/5 bg-gray-200 rounded" />
        <div className="mt-2 h-2 w-full bg-gray-100 rounded" />
        <div className="h-2 w-full bg-gray-100 rounded" />
        <div className="h-2 w-3/4 bg-gray-100 rounded" />
      </div>
      <span className="absolute top-2 left-2 text-[7px] text-white/80 font-mono uppercase tracking-wider">Brochure</span>
    </div>
  )
}

function BannerMockup() {
  return (
    <div className="relative w-52 h-20 rounded-xl overflow-hidden shadow-large border border-white/80" style={{ background: 'linear-gradient(90deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)' }}>
      <div className="absolute inset-0 bg-dots-dark opacity-20" />
      <div className="absolute inset-0 flex items-center px-5 gap-4">
        <div className="w-8 h-8 rounded-full bg-brand-gold/80 shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-2.5 w-32 bg-white/80 rounded" />
          <div className="h-1.5 w-24 bg-white/40 rounded" />
        </div>
      </div>
      <span className="absolute top-1.5 right-3 text-[7px] text-white/50 font-mono uppercase tracking-wider">Banner</span>
    </div>
  )
}

function PackagingMockup() {
  return (
    <div className="relative w-32 h-36 rounded-xl overflow-hidden shadow-large border border-white/80" style={{ background: 'linear-gradient(160deg, #fef9ec 0%, #fff3d4 100%)' }}>
      <div className="absolute top-0 left-0 right-0 h-8 border-b border-amber-200/60" style={{ background: 'linear-gradient(135deg, #F5A500 0%, #ffb300 100%)' }} />
      <div className="p-3 pt-11 space-y-1.5">
        <div className="h-2 w-full bg-amber-200/80 rounded" />
        <div className="h-2 w-3/4 bg-amber-200/60 rounded" />
        <div className="mt-2 w-10 h-10 mx-auto rounded-lg bg-amber-100 border border-amber-200/80 flex items-center justify-center">
          <div className="w-5 h-5 rounded bg-amber-400/60" />
        </div>
      </div>
      <span className="absolute top-1.5 left-2.5 text-[7px] text-white/80 font-mono uppercase tracking-wider">Packaging</span>
    </div>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '52+',  label: 'Years Excellence', color: '#F5A500' },
  { value: '10K+', label: 'Orders Delivered',  color: '#2D6FFF' },
  { value: '500+', label: 'Happy Businesses',  color: '#10B981' },
  { value: '24hr', label: 'Express Delivery',  color: '#8B5CF6' },
]

// ─── Trust Badges ─────────────────────────────────────────────────────────────

const TRUST = [
  { icon: CheckCircle, text: 'ISO Certified Quality',    color: '#10B981' },
  { icon: TrendingUp,  text: 'Bulk Pricing from ₹0.49/pc', color: '#2D6FFF' },
  { icon: Star,        text: '5.0 ★ (847 reviews)',       color: '#F5A500' },
]

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function HeroSection() {
  const mounted = useHasMounted()
  const ease = mounted

  return (
    <section className="relative min-h-[calc(100dvh-4rem)] flex items-center overflow-hidden bg-white">

      {/* Background — subtle dot grid */}
      <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" aria-hidden="true" />

      {/* Blue radial accent — top-left */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(45,111,255,0.07) 0%, transparent 70%)' }} aria-hidden="true" />
      {/* Gold radial accent — bottom-right */}
      <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,165,0,0.06) 0%, transparent 70%)' }} aria-hidden="true" />

      <div className="container-page relative z-10 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Content */}
          <div>
            {/* Pill badge */}
            <motion.div
              initial={ease ? { opacity: 0, y: -8 } : false}
              animate={ease ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 0.05 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-brand-blue text-sm font-semibold mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse-slow" />
              Now delivering pan-India — same week turnaround
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={ease ? { opacity: 0, y: 20 } : false}
              animate={ease ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-display font-bold leading-[1.08] text-text-primary"
            >
              Print with{' '}
              <span className="text-gradient-blue">Precision.</span>
              <br />
              <span className="relative inline-block">
                Trusted since 1972.
                <motion.span
                  initial={ease ? { scaleX: 0 } : false}
                  animate={ease ? { scaleX: 1 } : undefined}
                  transition={{ delay: 0.7, duration: 0.5, ease: 'easeOut' }}
                  className="absolute -bottom-1.5 left-0 right-0 h-1.5 rounded-full origin-left"
                  style={{ background: 'linear-gradient(90deg, #F5A500, #ff9500)' }}
                />
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={ease ? { opacity: 0, y: 12 } : false}
              animate={ease ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 0.22 }}
              className="mt-6 text-lg text-text-secondary leading-relaxed max-w-xl"
            >
              From 100 business cards to 100,000 brochures — Jawahar Printing Press has been
              Haryana&apos;s most trusted print partner for over 52 years. Bulk pricing, fast dispatch,
              and free design support.
            </motion.p>

            {/* Trust badges */}
            <motion.div
              initial={ease ? { opacity: 0 } : false}
              animate={ease ? { opacity: 1 } : undefined}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 mt-5"
            >
              {TRUST.map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex items-center gap-1.5 text-sm font-medium text-text-secondary">
                  <Icon size={15} style={{ color }} />
                  {text}
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={ease ? { opacity: 0, y: 12 } : false}
              animate={ease ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 0.35 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-8"
            >
              <Link href="/catalog">
                <Button variant="primary" size="lg" icon={<ArrowRight size={18} />} iconPosition="right" className="w-full sm:w-auto">
                  Browse Products
                </Button>
              </Link>
              <Link href="/order/custom">
                <Button variant="secondary" size="lg" icon={<Zap size={18} />} className="w-full sm:w-auto">
                  Get Instant Quote
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={ease ? { opacity: 0, y: 16 } : false}
              animate={ease ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 0.45 }}
              className="grid grid-cols-4 gap-4 mt-10 pt-8 border-t border-border"
            >
              {STATS.map(({ value, label, color }) => (
                <div key={label} className="text-center">
                  <p className="font-display font-bold text-2xl md:text-3xl leading-none" style={{ color }}>{value}</p>
                  <p className="text-xs text-text-secondary mt-1 leading-tight">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Product Mockups */}
          <motion.div
            initial={ease ? { opacity: 0, x: 24 } : false}
            animate={ease ? { opacity: 1, x: 0 } : undefined}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative hidden lg:flex items-center justify-center"
            style={{ minHeight: '480px' }}
          >
            {/* Center glow */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(45,111,255,0.06) 0%, transparent 70%)' }} aria-hidden="true" />

            {/* Floating mockup cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-4 left-0"
            >
              <BusinessCardMockup />
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute top-8 right-0"
            >
              <BrochureMockup />
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute bottom-20 left-4"
            >
              <BannerMockup />
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              className="absolute bottom-6 right-6"
            >
              <PackagingMockup />
            </motion.div>

            {/* Center feature card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              className="relative z-10 bg-white rounded-2xl border border-border shadow-large p-5 w-52"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-sm">
                  <Printer size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">JPP Quality</p>
                  <p className="text-xs text-text-secondary">300 DPI output</p>
                </div>
              </div>
              <div className="space-y-2">
                {['CMYK Color Accuracy', 'Premium Paper Stock', 'Fast Turnaround'].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle size={13} className="text-success shrink-0" />
                    <span className="text-xs text-text-secondary">{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <div className="flex -space-x-1.5">
                  {['#2D6FFF', '#10B981', '#F5A500', '#8B5CF6'].map((c) => (
                    <div key={c} className="w-5 h-5 rounded-full border-2 border-white" style={{ background: c }} />
                  ))}
                </div>
                <span className="text-[11px] text-text-secondary font-medium">500+ clients</span>
              </div>
            </motion.div>

            {/* Floating order badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={ease ? { opacity: 1, scale: 1 } : undefined}
              transition={{ delay: 0.8, type: 'spring' }}
              className="absolute -top-2 right-1/3 bg-success text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-medium flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              47 orders today
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
