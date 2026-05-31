'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, CheckCircle, ArrowRight, MessageCircle, Building2, Users, TrendingUp, Award } from 'lucide-react'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'

const WHATSAPP_URL = `https://wa.me/919999999999?text=${encodeURIComponent('Hi! I want to discuss a printing project.')}`

const INDUSTRIES = ['All', 'Retail', 'Healthcare', 'Real Estate', 'Education', 'Food & FMCG', 'Technology', 'Manufacturing', 'Pharma', 'Jewellery', 'Fashion']

const CLIENTS = [
  { name: 'Sharma Enterprises',    initials: 'SE', color: '#2D6FFF', industry: 'Retail',         location: 'Rohtak',  since: '2018', orders: '120+', products: ['Business Cards', 'Letterheads', 'Brochures'] },
  { name: 'AY Constructions',      initials: 'AY', color: '#10B981', industry: 'Real Estate',     location: 'Rohtak',  since: '2019', orders: '85+',  products: ['Brochures', 'Banners', 'Business Cards'] },
  { name: 'Gupta Fashion House',   initials: 'GF', color: '#F5A500', industry: 'Fashion',         location: 'Delhi',   since: '2020', orders: '60+',  products: ['Packaging', 'Tags', 'Brochures'] },
  { name: 'VS Pharma Distributors',initials: 'VP', color: '#8B5CF6', industry: 'Pharma',          location: 'Rohtak',  since: '2017', orders: '200+', products: ['Letterheads', 'Prescription Pads', 'Packaging'] },
  { name: 'Agarwal Sweets',        initials: 'AS', color: '#EF4444', industry: 'Food & FMCG',     location: 'Rohtak',  since: '2016', orders: '150+', products: ['Packaging Boxes', 'Labels', 'Banners'] },
  { name: 'Rohtak Motors',         initials: 'RM', color: '#0EA5E9', industry: 'Retail',          location: 'Rohtak',  since: '2021', orders: '40+',  products: ['Brochures', 'Business Cards', 'Banners'] },
  { name: 'City Hospital',         initials: 'CH', color: '#10B981', industry: 'Healthcare',      location: 'Rohtak',  since: '2018', orders: '95+',  products: ['Letterheads', 'Prescription Pads', 'OPD Cards'] },
  { name: 'Arora Real Estate',     initials: 'AR', color: '#F59E0B', industry: 'Real Estate',     location: 'Gurgaon', since: '2020', orders: '70+',  products: ['Brochures', 'Banners', 'Business Cards'] },
  { name: 'Joshi Boutique',        initials: 'JB', color: '#EC4899', industry: 'Fashion',         location: 'Delhi',   since: '2022', orders: '35+',  products: ['Packaging', 'Tags', 'Merchandise'] },
  { name: 'Haryana Seeds Ltd',     initials: 'HS', color: '#22C55E', industry: 'Manufacturing',   location: 'Hisar',   since: '2015', orders: '180+', products: ['Packaging', 'Labels', 'Brochures'] },
  { name: 'Prime Education Hub',   initials: 'PE', color: '#2D6FFF', industry: 'Education',       location: 'Rohtak',  since: '2019', orders: '55+',  products: ['Brochures', 'Certificates', 'Banners'] },
  { name: 'Deepak Industries',     initials: 'DI', color: '#64748B', industry: 'Manufacturing',   location: 'Panipat', since: '2017', orders: '110+', products: ['Letterheads', 'Packaging', 'Labels'] },
  { name: 'Lakshmi Kirana Store',  initials: 'LK', color: '#F5A500', industry: 'Food & FMCG',     location: 'Rohtak',  since: '2020', orders: '45+',  products: ['Banners', 'Price Tags', 'Receipts'] },
  { name: 'NextGen IT Solutions',  initials: 'NI', color: '#6366F1', industry: 'Technology',      location: 'Gurgaon', since: '2021', orders: '30+',  products: ['Business Cards', 'Letterheads', 'Brochures'] },
  { name: 'SK Jewellers',          initials: 'SJ', color: '#D97706', industry: 'Jewellery',       location: 'Rohtak',  since: '2016', orders: '90+',  products: ['Packaging', 'Certificates', 'Brochures'] },
  { name: 'Haryana Dairy Co.',     initials: 'HD', color: '#0891B2', industry: 'Food & FMCG',     location: 'Karnal',  since: '2018', orders: '130+', products: ['Packaging', 'Labels', 'Banners'] },
]

const TESTIMONIALS = [
  { name: 'Vikram Singh', company: 'VS Pharma Distributors', avatar: 'VS', gradient: 'from-purple-500 to-purple-700',
    quote: 'Regular customer for 3 years. JPP prints all our prescription pads, letterheads, and packaging. Consistent quality every time. The online ordering system is a game changer.', rating: 5 },
  { name: 'Meena Agarwal', company: 'Agarwal Sweets', avatar: 'MA', gradient: 'from-yellow-500 to-yellow-600',
    quote: '1000 Diwali packaging boxes delivered with perfect color accuracy. Our customers loved the packaging. Already re-ordered 2000 boxes for next season!', rating: 5 },
  { name: 'Deepak Arora', company: 'Arora Real Estate', avatar: 'DA', gradient: 'from-cyan-500 to-cyan-700',
    quote: 'Bulk property brochures with superb paper quality and color reproduction. Clients are impressed every time we hand them a brochure. Will stick with JPP indefinitely.', rating: 5 },
]

const STATS = [
  { value: '500+', label: 'Active Clients',   icon: Users,      color: '#2D6FFF' },
  { value: '52',   label: 'Years Serving',    icon: Award,      color: '#F5A500' },
  { value: '10K+', label: 'Orders Delivered', icon: TrendingUp, color: '#10B981' },
  { value: '11',   label: 'Industries Served',icon: Building2,  color: '#8B5CF6' },
]

function ClientCard({ client }: { client: typeof CLIENTS[number] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl border border-border hover:border-brand-blue/20 hover:shadow-medium hover:-translate-y-1 transition-all duration-300 p-5"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ background: `linear-gradient(135deg, ${client.color}, ${client.color}cc)` }}>
          {client.initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary leading-tight truncate">{client.name}</h3>
          <p className="text-xs text-text-secondary mt-0.5">{client.location} · Since {client.since}</p>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-50 text-brand-blue border border-blue-100 shrink-0">
          {client.orders} orders
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {client.products.slice(0, 3).map((p) => (
          <span key={p} className="text-[10px] px-2 py-0.5 rounded-md bg-bg-secondary border border-border text-text-secondary font-medium">
            {p}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="chip text-xs">{client.industry}</span>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={10} className="fill-amber-400 text-amber-400" />)}
        </div>
      </div>
    </motion.div>
  )
}

export default function ClientsPage() {
  const [industry, setIndustry] = useState('All')

  const filtered = CLIENTS.filter((c) => industry === 'All' || c.industry === industry)

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="bg-white border-b border-border">
        <div className="container-page py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="section-label">Our Clients</span>
            <h1 className="font-display font-bold text-text-primary mt-1">
              Trusted by 500+ businesses{' '}
              <span className="text-gradient-blue">across India.</span>
            </h1>
            <p className="text-text-secondary mt-4 text-lg leading-relaxed">
              From local kirana stores to large pharmaceutical companies — Jawahar Printing Press has been
              the print partner of choice for businesses in Haryana and beyond since 1972.
            </p>
            <div className="flex gap-3 mt-6">
              <Link href="/order/custom" className="flex items-center gap-2 h-11 px-6 rounded-xl bg-brand-blue text-white font-semibold text-sm hover:bg-[#1a5ce8] transition-colors shadow-glow-sm group">
                Become a Client <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 h-11 px-5 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 font-semibold text-sm hover:bg-[#25D366]/20 transition-colors">
                <MessageCircle size={15} /> WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-bg-secondary border-b border-border">
        <div className="container-page py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ value, label, icon: Icon, color }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}20` }}>
                  <Icon size={22} style={{ color }} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="font-display font-bold text-2xl text-text-primary">{value}</p>
                  <p className="text-xs text-text-secondary">{label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client grid */}
      <section className="section bg-white">
        <div className="container-page">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <h2 className="font-display font-bold text-2xl text-text-primary mb-4">Our Client Base</h2>
            {/* Industry filter */}
            <div className="flex gap-2 flex-wrap">
              {INDUSTRIES.map((ind) => (
                <button key={ind} onClick={() => setIndustry(ind)}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-xl transition-all ${
                    industry === ind ? 'bg-brand-blue text-white shadow-glow-sm' : 'bg-bg-secondary border border-border text-text-secondary hover:border-brand-blue/30 hover:text-brand-blue'
                  }`}>
                  {ind}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((client) => (
              <ClientCard key={client.name} client={client} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-text-secondary">No clients found in this industry yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-bg-secondary">
        <div className="container-page">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="section-label">What They Say</span>
            <h2 className="font-display font-bold text-text-primary">In their own words.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed flex-1">&#x201C;{t.quote}&#x201D;</p>
                <div className="flex items-center gap-3 pt-3 border-t border-border">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary flex items-center gap-1">
                      {t.name} <CheckCircle size={12} className="text-[#25D366]" />
                    </p>
                    <p className="text-xs text-text-tertiary">{t.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-white">
        <div className="container-page">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center p-10 rounded-3xl border-2 border-dashed border-brand-blue/20 bg-blue-50/50">
            <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Building2 size={24} className="text-white" />
            </div>
            <h2 className="font-display font-bold text-2xl text-text-primary mb-2">
              Ready to join our client family?
            </h2>
            <p className="text-text-secondary text-sm mb-6">
              Get a free consultation and bulk pricing quote tailored to your business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/order/custom" className="flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-brand-blue text-white font-semibold text-sm hover:bg-[#1a5ce8] transition-colors shadow-glow-sm">
                Get a Free Quote
              </Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 font-semibold text-sm hover:bg-[#25D366]/20 transition-colors">
                WhatsApp for Pricing
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  )
}
