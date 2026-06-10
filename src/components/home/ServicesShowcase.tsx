'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Printer, CreditCard, Package, Building2,
  Download, Calculator, MapPin,
  Layers, Zap, FileText, Star, Sparkles,
} from 'lucide-react'

type Service = {
  Icon: React.ElementType
  Sub1?: React.ElementType
  Sub2?: React.ElementType
  iconColor: string
  sub1Color?: string
  sub2Color?: string
  badge?: string
  badgeBg?: string
  title: string
  company: string
  companyColor: string
  desc: string
  link: string
}

/* ── Row 1: Core print services ── */
const ROW1: Service[] = [
  {
    Icon: Printer,
    Sub1: Star,
    Sub2: Sparkles,
    iconColor: '#2D6FFF',
    sub1Color: '#F5A500',
    sub2Color: '#93C5FD',
    badge: 'Popular',
    badgeBg: '#2D6FFF',
    title: 'Printing Services',
    company: 'Jawahar Printing Press',
    companyColor: '#2D6FFF',
    desc: 'A wide range of premium printing services — visiting cards, pamphlets, posters, stationery, and much more at competitive prices.',
    link: '/catalog',
  },
  {
    Icon: CreditCard,
    Sub1: Layers,
    Sub2: Zap,
    iconColor: '#10B981',
    sub1Color: '#059669',
    sub2Color: '#6EE7B7',
    title: 'Business Stationery',
    company: 'Jawahar Printing Press',
    companyColor: '#10B981',
    desc: 'Professional visiting cards, letterheads, envelopes and notepads on 350–600 GSM premium card stock.',
    link: '/catalog/business-cards',
  },
  {
    Icon: Package,
    Sub1: Zap,
    Sub2: Star,
    iconColor: '#EA580C',
    sub1Color: '#F97316',
    sub2Color: '#FED7AA',
    badge: 'New',
    badgeBg: '#10B981',
    title: 'Packaging Solutions',
    company: 'Jawahar Printing Press',
    companyColor: '#EA580C',
    desc: 'Custom printed rigid boxes, folding cartons, and mailer boxes — food-safe inks, custom die-cutting.',
    link: '/catalog/packaging',
  },
  {
    Icon: Building2,
    Sub1: FileText,
    Sub2: Layers,
    iconColor: '#8B5CF6',
    sub1Color: '#7C3AED',
    sub2Color: '#DDD6FE',
    title: 'Corporate Accounts',
    company: 'Jawahar Printing Press',
    companyColor: '#8B5CF6',
    desc: 'Free marketplace for bulk printing — dedicated account managers, volume discounts, and GST invoices.',
    link: '/clients',
  },
]

/* ── Row 2: Tools & utilities (like the screenshot's bottom 3) ── */
const ROW2: Service[] = [
  {
    Icon: Download,
    Sub1: FileText,
    Sub2: Sparkles,
    iconColor: '#0D9488',
    sub1Color: '#0F766E',
    sub2Color: '#99F6E4',
    badge: 'Free',
    badgeBg: '#0D9488',
    title: 'Free Design Templates',
    company: 'Free Resource by JPP',
    companyColor: '#0D9488',
    desc: 'Download free print-ready design templates and graphic resources crafted exclusively for printers and advertising agencies.',
    link: '/order/custom',
  },
  {
    Icon: Calculator,
    Sub1: Layers,
    Sub2: Zap,
    iconColor: '#F5A500',
    sub1Color: '#D97706',
    sub2Color: '#FDE68A',
    badge: 'Free Tool',
    badgeBg: '#F5A500',
    title: 'Paper GSM Calculator',
    company: 'Free Tool by JPP',
    companyColor: '#F5A500',
    desc: 'Free-to-use Paper GSM & Grammage Calculator — simple, accurate, and developed by Jawahar Printing Press.',
    link: '/gsm-calculator',
  },
  {
    Icon: MapPin,
    Sub1: Zap,
    Sub2: Star,
    iconColor: '#0EA5E9',
    sub1Color: '#0284C7',
    sub2Color: '#BAE6FD',
    title: 'Order Management',
    company: 'Free Service by JPP',
    companyColor: '#0EA5E9',
    desc: 'Free Printing Order Management — simple, powerful, and designed to streamline your daily print shop operations.',
    link: '/contact',
  },
]

function IllustrationArea({ service }: { service: Service }) {
  const { Icon, Sub1, Sub2, iconColor, sub1Color, sub2Color, badge, badgeBg } = service
  return (
    <div className="relative flex items-center justify-center bg-white overflow-hidden" style={{ height: 170 }}>
      {/* Badge */}
      {badge && (
        <span
          className="absolute top-3 left-3 z-20 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm"
          style={{ backgroundColor: badgeBg }}
        >
          {badge}
        </span>
      )}

      {/* Halo rings — concentric, very subtle */}
      <span
        className="absolute rounded-full pointer-events-none"
        style={{ width: 148, height: 148, backgroundColor: `${iconColor}07` }}
      />
      <span
        className="absolute rounded-full pointer-events-none"
        style={{ width: 112, height: 112, backgroundColor: `${iconColor}11` }}
      />
      <span
        className="absolute rounded-full pointer-events-none"
        style={{ width: 80, height: 80, backgroundColor: `${iconColor}18` }}
      />

      {/* Main icon */}
      <Icon
        size={68}
        style={{ color: iconColor }}
        strokeWidth={1.15}
        className="relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
      />

      {/* Floating secondary icon — bottom-right quadrant */}
      {Sub1 && (
        <Sub1
          size={20}
          strokeWidth={1.6}
          className="absolute z-10 opacity-80"
          style={{ color: sub1Color, bottom: 24, right: '22%' }}
        />
      )}

      {/* Tiny accent icon — top-right */}
      {Sub2 && (
        <Sub2
          size={14}
          strokeWidth={1.8}
          className="absolute z-10 opacity-60"
          style={{ color: sub2Color, top: 22, right: '20%' }}
        />
      )}
    </div>
  )
}

function ServiceCard({ service, delay }: { service: Service; delay: number }) {
  return (
    <motion.div
      key={service.title}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay, duration: 0.35 }}
      className="h-full"
    >
      <Link
        href={service.link}
        className="group flex flex-col rounded-2xl border border-border bg-white overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-full"
      >
        <IllustrationArea service={service} />

        {/* Divider */}
        <div className="h-px bg-border mx-0" />

        {/* Content */}
        <div className="flex flex-col flex-1 px-5 py-4 text-center">
          <h3 className="font-display font-bold text-[15px] text-text-primary leading-snug mb-1">
            {service.title}
          </h3>
          <p className="text-xs font-semibold mb-2.5" style={{ color: service.companyColor }}>
            {service.company}
          </p>
          <p className="text-xs text-text-secondary leading-relaxed">{service.desc}</p>
        </div>
      </Link>
    </motion.div>
  )
}

export default function ServicesShowcase() {
  return (
    <section className="py-14 bg-[#F8FAFC]">
      <div className="container-page">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <p className="text-sm text-text-secondary mb-1 tracking-wide uppercase font-semibold">
            — What We Offer —
          </p>
          <h2 className="font-display font-bold text-text-primary text-3xl sm:text-4xl">
            Our Services
          </h2>
          <p className="text-text-secondary mt-2 max-w-xl mx-auto text-[15px]">
            Everything a printing professional needs — under one roof.
          </p>
        </motion.div>

        {/* Row 1: 4 product service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
          {ROW1.map((s, i) => (
            <ServiceCard key={s.title} service={s} delay={i * 0.07} />
          ))}
        </div>

        {/* Row 2: 3 tool/utility cards — centered under row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:w-3/4 lg:mx-auto">
          {ROW2.map((s, i) => (
            <ServiceCard key={s.title} service={s} delay={(i + 4) * 0.07} />
          ))}
        </div>
      </div>
    </section>
  )
}
