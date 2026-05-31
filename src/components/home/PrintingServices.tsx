'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Printer, Layers, Palette, Box, Zap, Users, ArrowRight, CheckCircle,
} from 'lucide-react'

const SERVICES = [
  {
    icon: Printer,
    title: 'Offset Printing',
    desc: 'High-volume commercial printing using aluminium plates. Best for large runs (500+) requiring colour accuracy and consistency. Our Heidelberg press handles everything from business cards to large-format sheets.',
    features: ['CMYK + Pantone Spot', 'Up to 15,000 sheets/hr', 'Min. order 100 pcs', 'A6 to A1 formats'],
    color: '#2D6FFF',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    link: '/catalog',
  },
  {
    icon: Layers,
    title: 'Digital Printing',
    desc: 'On-demand printing with no plate cost. Perfect for short runs (5–499 pcs), personalised printing, variable data, and prototypes. Turnaround as fast as 24 hours.',
    features: ['No setup cost', 'Min. order 5 pcs', 'Variable data printing', '24-hr express option'],
    color: '#8B5CF6',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    link: '/catalog',
  },
  {
    icon: Palette,
    title: 'Specialty Finishes',
    desc: 'Transform ordinary prints into premium brand experiences. Gold & silver foil stamping, embossing, debossing, spot UV, soft-touch lamination, and edge painting.',
    features: ['Gold / Silver Foil', 'Spot UV Coating', 'Soft-Touch Lamination', 'Embossing & Debossing'],
    color: '#F5A500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    link: '/order/custom',
  },
  {
    icon: Box,
    title: 'Packaging Solutions',
    desc: 'Custom packaging that builds brand identity. Rigid boxes, folding cartons, corrugated boxes, mailer boxes, and sleeve packaging — all printed and finished in-house.',
    features: ['Rigid & Folding Cartons', 'Food-Safe Inks', 'Custom Die Cutting', 'CMYK + Pantone'],
    color: '#10B981',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    link: '/catalog/packaging',
  },
  {
    icon: Zap,
    title: 'Express Printing',
    desc: 'Same-day or next-day print service for urgent requirements. Standard products dispatched same day for orders placed before 12 PM. Available 6 days a week.',
    features: ['Same-day dispatch (12 PM)', 'Weekend availability', 'No extra setup fee', 'WhatsApp updates'],
    color: '#EA580C',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    link: '/order/custom',
  },
  {
    icon: Users,
    title: 'Corporate Printing',
    desc: 'Dedicated printing partnership for businesses. Annual printing contracts, bulk discounts, branded stationery kits, regular PO-based ordering, and assigned account manager.',
    features: ['Dedicated account manager', 'Bulk annual pricing', 'GST invoice included', 'Pan-India delivery'],
    color: '#0EA5E9',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    link: '/clients',
  },
]

export default function PrintingServices() {
  return (
    <section className="section bg-bg-secondary">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <span className="section-label">Our Services</span>
          <h2 className="font-display font-bold text-text-primary">
            Every printing service{' '}
            <span className="text-gradient-blue">under one roof.</span>
          </h2>
          <p className="text-text-secondary mt-3 max-w-2xl mx-auto">
            From quick-turn digital prints to long-run offset production and specialty finishes —
            JPP is the only print partner you&apos;ll ever need.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(({ icon: Icon, title, desc, features, color, bg, border, link }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
            >
              <div className="group relative bg-white rounded-2xl border border-border hover:border-transparent hover:shadow-large p-6 h-full flex flex-col transition-all duration-300 overflow-hidden">
                {/* Hover gradient border */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${color}15, transparent)` }} aria-hidden="true" />
                <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} aria-hidden="true" />

                {/* Icon */}
                <div className={`relative w-12 h-12 rounded-xl border ${bg} ${border} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105`}>
                  <Icon size={22} style={{ color }} strokeWidth={1.8} />
                </div>

                {/* Title & Desc */}
                <h3 className="font-display font-bold text-lg text-text-primary mb-2">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed flex-1 mb-4">{desc}</p>

                {/* Features list */}
                <div className="space-y-1.5 mb-5">
                  {features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle size={13} style={{ color }} className="shrink-0" />
                      <span className="text-xs text-text-secondary">{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link href={link}
                  className="relative flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group/btn"
                  style={{ background: `${color}10`, color }}>
                  <span>Learn more</span>
                  <ArrowRight size={15} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
