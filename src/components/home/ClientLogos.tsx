'use client'

import { motion } from 'framer-motion'

const CLIENTS = [
  { name: 'Sharma Enterprises',   initials: 'SE', color: '#2D6FFF', industry: 'Retail' },
  { name: 'AY Constructions',     initials: 'AY', color: '#10B981', industry: 'Real Estate' },
  { name: 'Gupta Fashion',        initials: 'GF', color: '#F5A500', industry: 'Fashion' },
  { name: 'VS Pharma',            initials: 'VP', color: '#8B5CF6', industry: 'Pharma' },
  { name: 'Agarwal Sweets',       initials: 'AS', color: '#EF4444', industry: 'Food & FMCG' },
  { name: 'Rohtak Motors',        initials: 'RM', color: '#0EA5E9', industry: 'Automotive' },
  { name: 'City Hospital',        initials: 'CH', color: '#10B981', industry: 'Healthcare' },
  { name: 'Arora Real Estate',    initials: 'AR', color: '#F59E0B', industry: 'Real Estate' },
  { name: 'Joshi Boutique',       initials: 'JB', color: '#EC4899', industry: 'Retail' },
  { name: 'Haryana Seeds',        initials: 'HS', color: '#22C55E', industry: 'Agriculture' },
  { name: 'Prime Education',      initials: 'PE', color: '#2D6FFF', industry: 'Education' },
  { name: 'Deepak Industries',    initials: 'DI', color: '#64748B', industry: 'Manufacturing' },
  { name: 'Lakshmi Kirana',       initials: 'LK', color: '#F5A500', industry: 'Grocery' },
  { name: 'NextGen IT',           initials: 'NI', color: '#6366F1', industry: 'Technology' },
  { name: 'SK Jewellers',         initials: 'SJ', color: '#D97706', industry: 'Jewellery' },
  { name: 'Haryana Dairy',        initials: 'HD', color: '#0891B2', industry: 'Dairy' },
]

const MARQUEE_1 = [...CLIENTS.slice(0, 8), ...CLIENTS.slice(0, 8)]
const MARQUEE_2 = [...CLIENTS.slice(8), ...CLIENTS.slice(8)]

function ClientCard({ client }: { client: typeof CLIENTS[number] }) {
  return (
    <div className="flex-shrink-0 flex items-center gap-3 px-5 py-3 bg-white border border-border rounded-xl shadow-soft hover:shadow-medium hover:border-brand-blue/20 transition-all duration-300 cursor-default select-none">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
        style={{ background: `linear-gradient(135deg, ${client.color}, ${client.color}cc)` }}
      >
        {client.initials}
      </div>
      <div className="whitespace-nowrap">
        <p className="text-sm font-semibold text-text-primary leading-tight">{client.name}</p>
        <p className="text-xs text-text-tertiary">{client.industry}</p>
      </div>
    </div>
  )
}

export default function ClientLogos() {
  return (
    <section className="py-16 overflow-hidden bg-white">
      <div className="container-page mb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <span className="section-label">Trusted By</span>
          <h2 className="font-display font-bold text-text-primary">
            500+ businesses trust JPP for{' '}
            <span className="text-gradient-blue">every print.</span>
          </h2>
          <p className="text-text-secondary mt-3 max-w-lg mx-auto">
            From local kirana stores to large corporations — all across Haryana and India.
          </p>
        </motion.div>
      </div>

      {/* Industry pills */}
      <div className="container-page mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {['Retail', 'Healthcare', 'Real Estate', 'Education', 'Food & FMCG', 'Technology', 'Manufacturing', 'Pharma'].map((ind) => (
            <span key={ind} className="chip">{ind}</span>
          ))}
        </div>
      </div>

      {/* Marquee Row 1 */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, white, transparent)' }} aria-hidden="true" />
        <div className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, white, transparent)' }} aria-hidden="true" />
        <div className="flex gap-3 animate-marquee group-hover:[animation-play-state:paused]" style={{ width: 'max-content' }}>
          {MARQUEE_1.map((c, i) => <ClientCard key={`r1-${i}`} client={c} />)}
        </div>
      </div>

      {/* Marquee Row 2 */}
      <div className="relative group mt-3">
        <div className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, white, transparent)' }} aria-hidden="true" />
        <div className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, white, transparent)' }} aria-hidden="true" />
        <div className="flex gap-3 animate-marquee-reverse group-hover:[animation-play-state:paused]" style={{ width: 'max-content' }}>
          {MARQUEE_2.map((c, i) => <ClientCard key={`r2-${i}`} client={c} />)}
        </div>
      </div>
    </section>
  )
}
