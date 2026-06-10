'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  CreditCard, BookOpen, Package, Megaphone,
  FileText, Heart, ImageIcon, Calculator,
} from 'lucide-react'

const SERVICES = [
  {
    Icon: CreditCard,
    bg: 'from-blue-100 to-blue-50',
    iconRing: '#BFDBFE',
    iconColor: '#2D6FFF',
    dots: ['#93C5FD', '#60A5FA', '#BFDBFE'],
    badge: 'Best Seller',
    badgeBg: '#2D6FFF',
    title: 'Business Cards',
    company: 'Jawahar Printing Press',
    companyColor: '#2D6FFF',
    desc: 'Premium matte, glossy, and spot-UV cards that make a lasting first impression on 350–600 GSM stock.',
    link: '/catalog/business-cards',
  },
  {
    Icon: BookOpen,
    bg: 'from-emerald-100 to-emerald-50',
    iconRing: '#BBF7D0',
    iconColor: '#10B981',
    dots: ['#86EFAC', '#4ADE80', '#BBF7D0'],
    badge: null,
    title: 'Brochures & Flyers',
    company: 'Jawahar Printing Press',
    companyColor: '#10B981',
    desc: 'Tri-fold, bi-fold, and Z-fold brochures on 130–170 GSM art paper for all your marketing needs.',
    link: '/catalog/brochures',
  },
  {
    Icon: Package,
    bg: 'from-orange-100 to-orange-50',
    iconRing: '#FED7AA',
    iconColor: '#EA580C',
    dots: ['#FDBA74', '#FB923C', '#FED7AA'],
    badge: null,
    title: 'Packaging Boxes',
    company: 'Jawahar Printing Press',
    companyColor: '#EA580C',
    desc: 'Custom printed rigid boxes, folding cartons, and mailer boxes for every product and occasion.',
    link: '/catalog/packaging',
  },
  {
    Icon: Megaphone,
    bg: 'from-purple-100 to-purple-50',
    iconRing: '#DDD6FE',
    iconColor: '#8B5CF6',
    dots: ['#C4B5FD', '#A78BFA', '#DDD6FE'],
    badge: null,
    title: 'Banners & Flex',
    company: 'Jawahar Printing Press',
    companyColor: '#8B5CF6',
    desc: 'Outdoor flex, vinyl, and canvas banners in any size — bold, weather-resistant, fast turnaround.',
    link: '/catalog/banners',
  },
  {
    Icon: FileText,
    bg: 'from-sky-100 to-sky-50',
    iconRing: '#BAE6FD',
    iconColor: '#0EA5E9',
    dots: ['#7DD3FC', '#38BDF8', '#BAE6FD'],
    badge: null,
    title: 'Letterheads & Stationery',
    company: 'Jawahar Printing Press',
    companyColor: '#0EA5E9',
    desc: 'Corporate stationery sets — letterheads, envelopes, and notepads that elevate your brand identity.',
    link: '/catalog/letterheads',
  },
  {
    Icon: Calculator,
    bg: 'from-amber-100 to-amber-50',
    iconRing: '#FDE68A',
    iconColor: '#F5A500',
    dots: ['#FCD34D', '#FBBF24', '#FDE68A'],
    badge: 'Free Tool',
    badgeBg: '#F5A500',
    title: 'Bulk Price Calculator',
    company: 'Free Tool by JPP',
    companyColor: '#F5A500',
    desc: 'Calculate bulk printing costs instantly — simple, accurate, and developed for print buyers.',
    link: '/#price-calculator',
  },
  {
    Icon: Heart,
    bg: 'from-rose-100 to-rose-50',
    iconRing: '#FECDD3',
    iconColor: '#E11D48',
    dots: ['#FDA4AF', '#FB7185', '#FECDD3'],
    badge: null,
    title: 'Wedding Cards',
    company: 'Jawahar Printing Press',
    companyColor: '#E11D48',
    desc: 'Elegant invitation cards, inserts, and envelopes with premium finishes for every special occasion.',
    link: '/catalog/wedding-cards',
  },
  {
    Icon: ImageIcon,
    bg: 'from-teal-100 to-teal-50',
    iconRing: '#99F6E4',
    iconColor: '#0D9488',
    dots: ['#5EEAD4', '#2DD4BF', '#99F6E4'],
    badge: null,
    title: 'Photo Printing',
    company: 'Jawahar Printing Press',
    companyColor: '#0D9488',
    desc: 'High-resolution photo prints on glossy, matte, and canvas for personal and professional use.',
    link: '/catalog/photo-printing',
  },
]

export default function ServicesShowcase() {
  return (
    <section className="py-16 bg-white">
      <div className="container-page">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <span className="section-label">Our Services</span>
          <h2 className="font-display font-bold text-text-primary text-3xl sm:text-4xl mt-1">
            Everything a printing professional needs{' '}
            <span className="text-gradient-blue">— under one roof.</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map(
            ({ Icon, bg, iconRing, iconColor, dots, badge, badgeBg, title, company, companyColor, desc, link }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
              >
                <Link
                  href={link}
                  className="group flex flex-col rounded-2xl border border-border bg-white overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full"
                >
                  {/* Illustration area */}
                  <div className={`relative bg-gradient-to-br ${bg} flex items-center justify-center overflow-hidden`} style={{ height: 168 }}>
                    {/* Badge */}
                    {badge && (
                      <span
                        className="absolute top-3 right-3 z-10 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: badgeBg }}
                      >
                        {badge}
                      </span>
                    )}

                    {/* Decorative dots */}
                    <span className="absolute top-4 left-5 w-8 h-8 rounded-full opacity-40" style={{ backgroundColor: dots[0] }} />
                    <span className="absolute bottom-4 right-6 w-5 h-5 rounded-full opacity-30" style={{ backgroundColor: dots[1] }} />
                    <span className="absolute bottom-6 left-10 w-3 h-3 rounded-full opacity-50" style={{ backgroundColor: dots[2] }} />
                    <span className="absolute top-7 right-10 w-2 h-2 rounded-full opacity-60" style={{ backgroundColor: dots[0] }} />

                    {/* Icon container */}
                    <div
                      className="relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundColor: `${iconColor}18`, border: `2px solid ${iconRing}` }}
                    >
                      {/* Inner glow circle */}
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `radial-gradient(circle at center, ${iconColor}25, transparent 70%)` }}
                      />
                      <Icon size={36} style={{ color: iconColor }} strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-4">
                    <p
                      className="text-xs font-semibold mb-1 truncate"
                      style={{ color: companyColor }}
                    >
                      {company}
                    </p>
                    <h3 className="font-display font-bold text-base text-text-primary mb-2 leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed flex-1">{desc}</p>
                    <span
                      className="mt-3 text-xs font-semibold group-hover:underline"
                      style={{ color: companyColor }}
                    >
                      Explore →
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  )
}
