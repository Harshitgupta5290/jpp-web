'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  CreditCard, BookOpen, Megaphone, Package,
  FileText, Heart, ImageIcon, Shirt,
} from 'lucide-react'

const CATEGORIES = [
  { slug: 'business-cards',  name: 'Business Cards',           description: 'Premium matte, glossy, and spot UV cards', icon: CreditCard,  color: 'from-blue-500/20 to-blue-600/5',    border: 'hover:border-blue-500/40',    iconColor: 'text-blue-400',    iconBg: 'bg-blue-500/10 border-blue-500/20',    tag: 'Most Popular', startingAt: '₹399' },
  { slug: 'brochures',       name: 'Brochures & Pamphlets',    description: 'Tri-fold, bi-fold, Z-fold — any size',      icon: BookOpen,    color: 'from-purple-500/20 to-purple-600/5', border: 'hover:border-purple-500/40',  iconColor: 'text-purple-400',  iconBg: 'bg-purple-500/10 border-purple-500/20', tag: null,           startingAt: '₹799' },
  { slug: 'banners',         name: 'Banners & Flex',           description: 'Outdoor flex, vinyl, canvas banners',       icon: Megaphone,   color: 'from-orange-500/20 to-orange-600/5', border: 'hover:border-orange-500/40',  iconColor: 'text-orange-400',  iconBg: 'bg-orange-500/10 border-orange-500/20', tag: 'Fast Delivery',startingAt: '₹299' },
  { slug: 'packaging',       name: 'Packaging Boxes',          description: 'Custom printed boxes for every product',    icon: Package,     color: 'from-green-500/20 to-green-600/5',   border: 'hover:border-green-500/40',   iconColor: 'text-green-400',   iconBg: 'bg-green-500/10 border-green-500/20',   tag: null,           startingAt: '₹2,499' },
  { slug: 'letterheads',     name: 'Letterheads & Stationery', description: 'Professional corporate stationery sets',    icon: FileText,    color: 'from-cyan-500/20 to-cyan-600/5',     border: 'hover:border-cyan-500/40',    iconColor: 'text-cyan-400',    iconBg: 'bg-cyan-500/10 border-cyan-500/20',     tag: null,           startingAt: '₹599' },
  { slug: 'wedding-cards',   name: 'Wedding Cards',            description: 'Elegant invitation cards & inserts',        icon: Heart,       color: 'from-pink-500/20 to-pink-600/5',     border: 'hover:border-pink-500/40',    iconColor: 'text-pink-400',    iconBg: 'bg-pink-500/10 border-pink-500/20',     tag: 'Trending',     startingAt: '₹1,299' },
  { slug: 'photo-printing',  name: 'Photo Printing',           description: 'High-res photo prints, canvas, frames',     icon: ImageIcon,   color: 'from-yellow-500/20 to-yellow-600/5', border: 'hover:border-yellow-500/40',  iconColor: 'text-yellow-400',  iconBg: 'bg-yellow-500/10 border-yellow-500/20', tag: null,           startingAt: '₹49' },
  { slug: 'merchandise',     name: 'Branded Merchandise',      description: 'T-shirts, mugs, pens with your logo',       icon: Shirt,       color: 'from-indigo-500/20 to-indigo-600/5', border: 'hover:border-indigo-500/40',  iconColor: 'text-indigo-400',  iconBg: 'bg-indigo-500/10 border-indigo-500/20', tag: 'New',          startingAt: '₹199' },
] as const

export default function CategoryGrid() {
  return (
    <section
      className="relative overflow-hidden py-20"
      style={{
        background: 'radial-gradient(ellipse 70% 60% at 0% 50%, rgba(45,111,255,0.06) 0%, transparent 55%), radial-gradient(ellipse 70% 60% at 100% 50%, rgba(245,197,24,0.04) 0%, transparent 55%), #0A0F1E',
      }}
    >
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      <div className="container-page relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold text-brand-blue tracking-[0.25em] uppercase mb-3">
            What We Print
          </p>
          <h2 className="font-display font-bold text-text-primary">
            Everything your business needs,{' '}
            <span className="text-gradient-blue">printed perfectly.</span>
          </h2>
          <p className="text-text-secondary mt-3 max-w-xl mx-auto">
            From 100 to 100,000 units — we handle every scale with the same precision and care.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map(({ slug, name, description, icon: Icon, border, iconColor, iconBg, tag, startingAt }, i) => (
            <motion.div
              key={slug}
              initial={{ y: 24 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
            >
              <Link
                href={`/catalog/${slug}`}
                className={`group block relative overflow-hidden rounded-xl p-5 h-full transition-all duration-300 ${border}`}
                style={{
                  background: 'linear-gradient(135deg, #161D2F 0%, #111827 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                {/* Hover glow overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
                  style={{ background: 'radial-gradient(ellipse at top left, rgba(45,111,255,0.08) 0%, transparent 60%)' }}
                  aria-hidden="true"
                />

                {/* Icon + Tag */}
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className={`w-12 h-12 rounded-xl border ${iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={22} className={iconColor} strokeWidth={1.8} />
                  </div>
                  {tag && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                      {tag}
                    </span>
                  )}
                </div>

                <h3 className="relative z-10 font-display font-semibold text-base text-text-primary leading-snug group-hover:text-white transition-colors">
                  {name}
                </h3>
                <p className="relative z-10 text-sm text-text-secondary mt-1.5 leading-relaxed">
                  {description}
                </p>

                <div className="relative z-10 flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                  <span className="text-xs text-text-secondary">
                    Starting at{' '}
                    <span className="font-price font-semibold text-text-primary">{startingAt}</span>
                  </span>
                  <span className="text-xs text-brand-blue font-medium opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 transform duration-200">
                    Order →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 10 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link href="/catalog" className="inline-flex items-center gap-2 text-sm text-brand-blue hover:text-blue-400 font-medium transition-colors">
            View all products & categories →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
