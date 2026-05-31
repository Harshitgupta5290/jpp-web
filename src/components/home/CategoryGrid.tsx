'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  CreditCard, BookOpen, Megaphone, Package,
  FileText, Heart, ImageIcon, Shirt, ArrowRight,
} from 'lucide-react'

const CATEGORIES = [
  {
    slug: 'business-cards', name: 'Business Cards', description: 'Premium matte, glossy, and spot UV cards',
    icon: CreditCard, startingAt: '₹399',
    tag: 'Most Popular',
    gradient: 'from-blue-500 to-blue-700',
    softBg: 'bg-blue-50', softBorder: 'border-blue-100 hover:border-blue-300', iconColor: 'text-blue-600',
    accentColor: '#2D6FFF',
    mockupColors: ['#1d4ed8', '#3b82f6', '#93c5fd'],
  },
  {
    slug: 'brochures', name: 'Brochures & Pamphlets', description: 'Tri-fold, bi-fold, Z-fold — any size',
    icon: BookOpen, startingAt: '₹799',
    tag: null,
    gradient: 'from-purple-500 to-purple-700',
    softBg: 'bg-purple-50', softBorder: 'border-purple-100 hover:border-purple-300', iconColor: 'text-purple-600',
    accentColor: '#9333EA',
    mockupColors: ['#7c3aed', '#a855f7', '#d8b4fe'],
  },
  {
    slug: 'banners', name: 'Banners & Flex', description: 'Outdoor flex, vinyl, canvas banners',
    icon: Megaphone, startingAt: '₹299',
    tag: 'Fast Delivery',
    gradient: 'from-orange-500 to-orange-700',
    softBg: 'bg-orange-50', softBorder: 'border-orange-100 hover:border-orange-300', iconColor: 'text-orange-600',
    accentColor: '#EA580C',
    mockupColors: ['#c2410c', '#f97316', '#fed7aa'],
  },
  {
    slug: 'packaging', name: 'Packaging Boxes', description: 'Custom printed boxes for every product',
    icon: Package, startingAt: '₹2,499',
    tag: null,
    gradient: 'from-green-500 to-green-700',
    softBg: 'bg-green-50', softBorder: 'border-green-100 hover:border-green-300', iconColor: 'text-green-600',
    accentColor: '#16A34A',
    mockupColors: ['#15803d', '#22c55e', '#bbf7d0'],
  },
  {
    slug: 'letterheads', name: 'Letterheads & Stationery', description: 'Professional corporate stationery sets',
    icon: FileText, startingAt: '₹599',
    tag: null,
    gradient: 'from-cyan-500 to-cyan-700',
    softBg: 'bg-cyan-50', softBorder: 'border-cyan-100 hover:border-cyan-300', iconColor: 'text-cyan-600',
    accentColor: '#0891B2',
    mockupColors: ['#0e7490', '#06b6d4', '#a5f3fc'],
  },
  {
    slug: 'wedding-cards', name: 'Wedding Cards', description: 'Elegant invitation cards & inserts',
    icon: Heart, startingAt: '₹1,299',
    tag: 'Trending',
    gradient: 'from-pink-500 to-pink-700',
    softBg: 'bg-pink-50', softBorder: 'border-pink-100 hover:border-pink-300', iconColor: 'text-pink-600',
    accentColor: '#DB2777',
    mockupColors: ['#be185d', '#ec4899', '#fbcfe8'],
  },
  {
    slug: 'photo-printing', name: 'Photo Printing', description: 'High-res photo prints, canvas, frames',
    icon: ImageIcon, startingAt: '₹49',
    tag: null,
    gradient: 'from-yellow-500 to-yellow-700',
    softBg: 'bg-yellow-50', softBorder: 'border-yellow-100 hover:border-yellow-300', iconColor: 'text-yellow-600',
    accentColor: '#CA8A04',
    mockupColors: ['#a16207', '#eab308', '#fef9c3'],
  },
  {
    slug: 'merchandise', name: 'Branded Merchandise', description: 'T-shirts, mugs, pens with your logo',
    icon: Shirt, startingAt: '₹199',
    tag: 'New',
    gradient: 'from-indigo-500 to-indigo-700',
    softBg: 'bg-indigo-50', softBorder: 'border-indigo-100 hover:border-indigo-300', iconColor: 'text-indigo-600',
    accentColor: '#4F46E5',
    mockupColors: ['#4338ca', '#6366f1', '#c7d2fe'],
  },
] as const

export default function CategoryGrid() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <span className="section-label">What We Print</span>
          <h2 className="font-display font-bold text-text-primary">
            Everything your business needs,{' '}
            <span className="text-gradient-blue">printed perfectly.</span>
          </h2>
          <p className="text-text-secondary mt-3 max-w-xl mx-auto">
            From 100 to 100,000 units — we handle every scale with the same precision and care.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map(({ slug, name, description, icon: Icon, softBg, softBorder, iconColor, tag, startingAt, accentColor, mockupColors }, i) => (
            <motion.div
              key={slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
            >
              <Link
                href={`/catalog/${slug}`}
                className={`group block relative bg-white rounded-2xl border p-5 h-full transition-all duration-300 hover:shadow-medium hover:-translate-y-1 ${softBorder}`}
              >
                {/* Mini colour bar at top */}
                <div className="absolute top-0 left-5 right-5 h-0.5 rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, ${accentColor}80, ${accentColor})` }} aria-hidden="true" />

                {/* Mini product mockup visual */}
                <div className={`relative w-full h-24 rounded-xl mb-4 overflow-hidden ${softBg}`}>
                  {/* Abstract product shapes */}
                  <div className="absolute bottom-2 left-3 right-3 flex gap-1.5 items-end">
                    {mockupColors.map((c, ci) => (
                      <div key={ci} className="rounded flex-1" style={{ background: c, height: `${40 + ci * 14}%`, opacity: 0.7 + ci * 0.1 }} />
                    ))}
                  </div>
                  <div className={`absolute top-2 right-2 w-7 h-7 rounded-lg ${softBg} border ${softBorder.split(' ')[0]} flex items-center justify-center`}>
                    <Icon size={14} className={iconColor} strokeWidth={1.8} />
                  </div>
                  {tag && (
                    <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ background: accentColor }}>
                      {tag}
                    </span>
                  )}
                </div>

                <h3 className="font-display font-semibold text-base text-text-primary leading-snug group-hover:text-text-primary transition-colors">
                  {name}
                </h3>
                <p className="text-sm text-text-secondary mt-1.5 leading-relaxed line-clamp-2">
                  {description}
                </p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div>
                    <span className="text-xs text-text-tertiary">Starting at </span>
                    <span className="font-price font-bold text-text-primary">{startingAt}</span>
                  </div>
                  <span
                    className="flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0 duration-200"
                    style={{ color: accentColor }}
                  >
                    Order <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link href="/catalog" className="inline-flex items-center gap-2 text-sm text-brand-blue hover:text-[#1a5ce8] font-semibold transition-colors group">
            View all products & categories
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
