'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Eye } from 'lucide-react'
import Link from 'next/link'

const PORTFOLIO = [
  { id: 1, title: 'Corporate Identity Kit',    category: 'Business Cards', colors: ['#1d4ed8','#3b82f6','#eff6ff'], size: 'col-span-1 row-span-1', tag: 'Spot UV' },
  { id: 2, title: 'Product Packaging',          category: 'Packaging',      colors: ['#16a34a','#22c55e','#f0fdf4'], size: 'col-span-1 row-span-2', tag: 'Gold Foil' },
  { id: 3, title: 'Event Brochure Series',       category: 'Brochures',      colors: ['#7c3aed','#a855f7','#f5f3ff'], size: 'col-span-2 row-span-1', tag: 'Matte Lam' },
  { id: 4, title: 'Outdoor Billboard Campaign',  category: 'Banners',        colors: ['#ea580c','#f97316','#fff7ed'], size: 'col-span-1 row-span-1', tag: 'UV Inks' },
  { id: 5, title: 'Wedding Invitation Set',      category: 'Wedding Cards',  colors: ['#be185d','#ec4899','#fdf2f8'], size: 'col-span-1 row-span-1', tag: 'Embossed' },
  { id: 6, title: 'Annual Report Printing',      category: 'Brochures',      colors: ['#0e7490','#06b6d4','#ecfeff'], size: 'col-span-1 row-span-1', tag: 'Saddle Stitch' },
  { id: 7, title: 'Branded Merchandise Line',    category: 'Merchandise',    colors: ['#4338ca','#6366f1','#eef2ff'], size: 'col-span-2 row-span-1', tag: 'Full Colour' },
]

function GalleryCard({ item, delay }: { item: typeof PORTFOLIO[number]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay, duration: 0.4 }}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer ${item.size}`}
      style={{ minHeight: '160px' }}
    >
      {/* Visual background */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})` }} />

      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-dots-dark opacity-20" />

      {/* Decorative shapes */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-20" style={{ background: item.colors[2] }} />
      <div className="absolute top-4 left-4 w-12 h-12 rounded-xl opacity-30" style={{ background: 'rgba(255,255,255,0.2)' }} />

      {/* Tag */}
      <div className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
        {item.tag}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="text-center">
          <Eye size={24} className="text-white mx-auto mb-2 opacity-90" />
          <p className="text-white font-semibold text-sm">{item.title}</p>
          <p className="text-white/70 text-xs mt-0.5">{item.category}</p>
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
        <p className="text-white font-semibold text-sm leading-tight">{item.title}</p>
        <p className="text-white/70 text-xs">{item.category}</p>
      </div>
    </motion.div>
  )
}

export default function PortfolioGallery() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="section-label">Portfolio</span>
            <h2 className="font-display font-bold text-text-primary">
              Print samples from{' '}
              <span className="text-gradient-blue">our press.</span>
            </h2>
            <p className="text-text-secondary mt-2 max-w-lg">
              A glimpse of the quality and variety of work we deliver every week.
            </p>
          </div>
          <Link href="/clients" className="flex items-center gap-1.5 text-sm text-brand-blue font-semibold hover:underline shrink-0 group">
            View all work <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[160px]">
          {PORTFOLIO.map((item, i) => (
            <GalleryCard key={item.id} item={item} delay={i * 0.06} />
          ))}
        </div>

        {/* Request sample CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-10 text-center"
        >
          <p className="text-text-secondary text-sm mb-3">Want to see & feel the print quality before ordering?</p>
          <Link href="/contact"
            className="inline-flex items-center gap-2 h-10 px-6 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold text-sm hover:bg-blue-50 transition-colors">
            Request a Free Sample Kit
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
