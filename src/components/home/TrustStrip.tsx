'use client'

import { motion } from 'framer-motion'
import { Shield, Truck, Clock, Award, Headphones, BadgeCheck } from 'lucide-react'

const TRUST_ITEMS = [
  { icon: Award,       label: 'Est. 1972',          sub: '52 years of trust',        color: 'text-brand-gold',  bg: 'bg-brand-gold/10 border-brand-gold/25',   glow: 'rgba(245,197,24,0.12)' },
  { icon: Truck,       label: 'Pan-India Delivery',  sub: 'All 28 states',            color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/25',       glow: 'rgba(96,165,250,0.12)' },
  { icon: Clock,       label: 'Same Day Dispatch',   sub: 'Orders before 12 PM',      color: 'text-purple-400',  bg: 'bg-purple-500/10 border-purple-500/25',   glow: 'rgba(168,85,247,0.12)' },
  { icon: Shield,      label: '100% Secure Pay',     sub: 'Razorpay encrypted',       color: 'text-brand-blue',  bg: 'bg-brand-blue/10 border-brand-blue/25',   glow: 'rgba(45,111,255,0.12)' },
  { icon: Headphones,  label: 'WhatsApp Support',    sub: 'Mon–Sat, 9 AM–7 PM',       color: 'text-[#25D366]',   bg: 'bg-[#25D366]/10 border-[#25D366]/25',     glow: 'rgba(37,211,102,0.12)' },
  { icon: BadgeCheck,  label: 'Quality Guarantee',   sub: 'Free reprint if faulty',   color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/25', glow: 'rgba(52,211,153,0.12)' },
]

export default function TrustStrip() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0A0F1E 0%, #0d1220 50%, #0A0F1E 100%)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Background mesh */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(ellipse 60% 80% at 20% 50%, rgba(45,111,255,0.05) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 50%, rgba(245,197,24,0.04) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="container-page py-14 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {TRUST_ITEMS.map(({ icon: Icon, label, sub, color, bg, glow }, i) => (
            <motion.div
              key={label}
              initial={{ y: 16 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              className="flex flex-col items-center text-center gap-3 group"
            >
              <div
                className={`w-12 h-12 rounded-xl border ${bg} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}
                style={{ boxShadow: `0 0 20px ${glow}` }}
              >
                <Icon size={20} className={color} strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary leading-tight">{label}</p>
                <p className="text-xs text-text-secondary mt-0.5">{sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
