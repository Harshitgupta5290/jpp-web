'use client'

import { motion } from 'framer-motion'
import { ClipboardList, Palette, CreditCard, PackageCheck } from 'lucide-react'

const STEPS = [
  {
    step: '01', icon: ClipboardList,
    title: 'Choose & Customize',
    description: 'Select your product, pick size, paper type, and finish. Our live calculator shows exact pricing as you configure.',
    color: 'text-brand-blue', bg: 'bg-brand-blue/10 border-brand-blue/30',
    glow: 'rgba(45,111,255,0.2)',
  },
  {
    step: '02', icon: Palette,
    title: 'Upload or Design',
    description: 'Upload your print-ready artwork (PDF/AI/PSD) or let our AI Design Brief tool help you communicate your vision.',
    color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30',
    glow: 'rgba(168,85,247,0.2)',
  },
  {
    step: '03', icon: CreditCard,
    title: 'Pay 50% Advance',
    description: 'Confirm your order with a 50% advance via Razorpay. Balance can be paid online or as cash-on-delivery.',
    color: 'text-brand-gold', bg: 'bg-brand-gold/10 border-brand-gold/30',
    glow: 'rgba(245,197,24,0.2)',
  },
  {
    step: '04', icon: PackageCheck,
    title: 'Receive Your Print',
    description: 'Track your order in real-time. Same-day dispatch for orders before 12 PM. Pan-India delivery in 3–7 days.',
    color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30',
    glow: 'rgba(52,211,153,0.2)',
  },
]

export default function HowItWorks() {
  return (
    <section
      className="relative overflow-hidden py-20"
      style={{ background: '#090e1b' }}
    >
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(45,111,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(45,111,255,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />

      {/* Center radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(45,111,255,0.05) 0%, transparent 65%)' }}
        aria-hidden="true"
      />

      {/* Top/bottom borders */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(45,111,255,0.3), transparent)' }} aria-hidden="true" />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(45,111,255,0.3), transparent)' }} aria-hidden="true" />

      <div className="container-page relative z-10">
        <motion.div
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold text-brand-blue tracking-[0.25em] uppercase mb-3">
            Simple Process
          </p>
          <h2 className="font-display font-bold text-text-primary">
            From idea to inbox{' '}
            <span className="text-gradient-gold">in 4 easy steps.</span>
          </h2>
          <p className="text-text-secondary mt-3 max-w-xl mx-auto">
            No confusing back-and-forth. Just a clean, transparent process designed for busy business owners.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line — desktop */}
          <div
            className="hidden lg:block absolute top-[2.75rem] left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(45,111,255,0.3) 15%, rgba(45,111,255,0.3) 85%, transparent)' }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map(({ step, icon: Icon, title, description, color, bg, glow }, i) => (
              <motion.div
                key={step}
                initial={{ y: 24 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.35 }}
                className="flex flex-col items-center text-center group"
              >
                <div
                  className={`relative w-16 h-16 rounded-2xl border ${bg} flex items-center justify-center mb-6 shrink-0 transition-transform duration-300 group-hover:scale-110`}
                  style={{ boxShadow: `0 0 28px ${glow}` }}
                >
                  <Icon size={26} className={color} strokeWidth={1.8} />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-bg-primary border border-border text-[10px] font-bold text-text-secondary flex items-center justify-center font-mono">
                    {step}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-base text-text-primary mb-2">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
