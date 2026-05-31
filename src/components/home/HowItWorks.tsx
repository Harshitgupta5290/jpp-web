'use client'

import { motion } from 'framer-motion'
import { ClipboardList, Palette, CreditCard, PackageCheck, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const STEPS = [
  {
    step: '01', icon: ClipboardList,
    title: 'Choose & Customize',
    description: 'Pick your product, select size, paper type, and finish. Our live price calculator shows your exact cost as you configure — zero hidden charges.',
    color: '#2D6FFF', softBg: 'bg-blue-50', softBorder: 'border-blue-100',
  },
  {
    step: '02', icon: Palette,
    title: 'Upload or Design',
    description: 'Upload print-ready artwork (PDF/AI/PSD) or describe your vision over WhatsApp. Our in-house designers provide free guidance on artwork preparation.',
    color: '#8B5CF6', softBg: 'bg-purple-50', softBorder: 'border-purple-100',
  },
  {
    step: '03', icon: CreditCard,
    title: 'Pay 50% Advance',
    description: "Confirm with a 50% advance via Razorpay — cards, UPI, net banking all accepted. Balance is collected on delivery or before dispatch, whichever you prefer.",
    color: '#F5A500', softBg: 'bg-amber-50', softBorder: 'border-amber-100',
  },
  {
    step: '04', icon: PackageCheck,
    title: 'Receive Your Print',
    description: 'Track in real-time. Same-day dispatch for orders before 12 PM. Pan-India delivery in 3–7 business days. Free reprint if quality doesn\'t meet expectations.',
    color: '#10B981', softBg: 'bg-emerald-50', softBorder: 'border-emerald-100',
  },
]

export default function HowItWorks() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <span className="section-label">Simple Process</span>
          <h2 className="font-display font-bold text-text-primary">
            From idea to inbox{' '}
            <span className="text-gradient-gold">in 4 easy steps.</span>
          </h2>
          <p className="text-text-secondary mt-3 max-w-xl mx-auto">
            No confusing back-and-forth. Just a clean, transparent process designed for busy business owners.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting dashed line — desktop */}
          <div
            className="hidden lg:block absolute top-[2.5rem] left-[calc(12.5%+2.5rem)] right-[calc(12.5%+2.5rem)] h-px border-t-2 border-dashed border-border"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map(({ step, icon: Icon, title, description, color, softBg, softBorder }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon circle */}
                <div className="relative mb-6">
                  <div className={`w-20 h-20 rounded-2xl border-2 ${softBg} ${softBorder} flex items-center justify-center transition-all duration-300 group-hover:shadow-medium group-hover:scale-105`}>
                    <Icon size={28} style={{ color }} strokeWidth={1.8} />
                  </div>
                  {/* Step badge */}
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 text-[10px] font-bold text-text-secondary flex items-center justify-center font-mono shadow-soft"
                    style={{ borderColor: color }}>
                    {step}
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-text-primary mb-2">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mt-12"
        >
          <Link href="/catalog"
            className="flex items-center gap-2 h-12 px-8 rounded-xl bg-brand-blue text-white font-semibold text-sm hover:bg-[#1a5ce8] transition-colors shadow-glow-sm group">
            Start Your First Order
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
