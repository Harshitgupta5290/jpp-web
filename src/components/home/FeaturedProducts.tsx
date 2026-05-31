'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star, TrendingUp, Zap } from 'lucide-react'

const FEATURED = [
  {
    id: 1, slug: '/catalog/business-cards/standard-business-cards',
    name: 'Standard Business Cards',
    category: 'Business Cards',
    price: '₹3.99/pc',
    moq: 'Min. 100 pcs',
    rating: 5.0, reviews: 312,
    badge: { text: 'Best Seller', color: '#2D6FFF', bg: '#EFF6FF' },
    desc: '350 GSM art board, matte & glossy options. Perfect for professionals.',
    colors: ['#1d4ed8', '#3b82f6', '#bfdbfe'],
    turnaround: '3–5 days',
  },
  {
    id: 2, slug: '/catalog/brochures/a4-tri-fold-brochure',
    name: 'A4 Tri-Fold Brochure',
    category: 'Brochures',
    price: '₹8.00/pc',
    moq: 'Min. 100 pcs',
    rating: 4.9, reviews: 187,
    badge: { text: 'Top Rated', color: '#9333EA', bg: '#F5F3FF' },
    desc: '130/170 GSM art paper, full-color double-sided. Ideal for marketing.',
    colors: ['#7c3aed', '#a855f7', '#e9d5ff'],
    turnaround: '4–6 days',
  },
  {
    id: 3, slug: '/catalog/banners/outdoor-flex-banner',
    name: 'Outdoor Flex Banner',
    category: 'Banners & Flex',
    price: '₹35/sqft',
    moq: 'Any size',
    rating: 4.9, reviews: 203,
    badge: { text: 'Fast Dispatch', color: '#EA580C', bg: '#FFF7ED' },
    desc: '270 GSM frontlit flex, UV-resistant inks, reinforced edges & grommets.',
    colors: ['#c2410c', '#f97316', '#fed7aa'],
    turnaround: '1–2 days',
  },
  {
    id: 4, slug: '/catalog/wedding-cards',
    name: 'Wedding Invitation Cards',
    category: 'Wedding Cards',
    price: '₹25/pc',
    moq: 'Min. 50 pcs',
    rating: 5.0, reviews: 156,
    badge: { text: 'Trending', color: '#DB2777', bg: '#FDF2F8' },
    desc: 'Elegant designs with gold foiling, spot UV, and custom inserts.',
    colors: ['#be185d', '#ec4899', '#fbcfe8'],
    turnaround: '5–7 days',
  },
]

function ProductVisual({ colors, name }: { colors: string[]; name: string }) {
  return (
    <div className="relative w-full h-36 rounded-xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}>
      {/* Decorative shapes */}
      <div className="absolute top-3 left-3 w-16 h-16 rounded-lg opacity-30" style={{ background: colors[2] }} />
      <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full opacity-20" style={{ background: colors[2] }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-14 rounded-lg border-2 border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center">
        <span className="text-white/80 text-xs font-bold tracking-wide text-center leading-tight px-2">{name.split(' ').slice(0, 2).join('\n')}</span>
      </div>
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 bg-dots-dark opacity-20" />
    </div>
  )
}

export default function FeaturedProducts() {
  return (
    <section className="section bg-bg-secondary">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="section-label">Bestsellers</span>
            <h2 className="font-display font-bold text-text-primary">
              Most ordered{' '}
              <span className="text-gradient-gold">this week.</span>
            </h2>
          </div>
          <Link href="/catalog" className="flex items-center gap-1.5 text-sm text-brand-blue font-semibold hover:underline shrink-0 group">
            View full catalog <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED.map(({ id, slug, name, category, price, moq, rating, reviews, badge, desc, colors, turnaround }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
            >
              <Link href={slug} className="group block bg-white rounded-2xl border border-border hover:border-brand-blue/20 hover:shadow-medium hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full">
                {/* Product visual */}
                <div className="p-4 pb-0">
                  <ProductVisual colors={colors} name={name} />
                </div>

                {/* Info */}
                <div className="p-4">
                  {/* Badge + Category */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-text-tertiary">{category}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: badge.color, background: badge.bg }}>
                      {badge.text}
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-base text-text-primary leading-snug mb-1.5 group-hover:text-brand-blue transition-colors">
                    {name}
                  </h3>

                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-3">{desc}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-text-secondary font-medium">{rating} ({reviews})</span>
                  </div>

                  {/* Turnaround */}
                  <div className="flex items-center gap-1 text-xs text-success font-medium mb-3">
                    <Zap size={11} />
                    Delivery in {turnaround}
                  </div>

                  {/* Price + MOQ */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div>
                      <p className="font-price font-bold text-lg text-text-primary leading-none">{price}</p>
                      <p className="text-[11px] text-text-tertiary mt-0.5">{moq}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
                      <ArrowRight size={15} className="text-brand-blue group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-10 p-6 rounded-2xl bg-gradient-brand flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-white text-center sm:text-left">
            <p className="font-display font-bold text-lg">Need a bulk order or something custom?</p>
            <p className="text-white/80 text-sm mt-0.5">Get a quote in minutes — no design needed.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/order/custom" className="flex items-center gap-2 h-10 px-5 rounded-lg bg-white text-brand-blue text-sm font-bold hover:bg-blue-50 transition-colors">
              <TrendingUp size={15} /> Get Custom Quote
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
