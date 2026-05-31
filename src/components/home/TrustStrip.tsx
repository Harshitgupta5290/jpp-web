'use client'

import { motion } from 'framer-motion'
import { Shield, Truck, Clock, Award, Headphones, BadgeCheck } from 'lucide-react'

const TRUST_ITEMS = [
  { icon: Award,       label: 'Est. 1972',           sub: '52 years of trust',         color: '#F5A500',  bg: 'bg-amber-50',   border: 'border-amber-100' },
  { icon: Truck,       label: 'Pan-India Delivery',   sub: 'All 28+ states',            color: '#2D6FFF',  bg: 'bg-blue-50',    border: 'border-blue-100' },
  { icon: Clock,       label: 'Same Day Dispatch',    sub: 'Orders before 12 PM',       color: '#8B5CF6',  bg: 'bg-purple-50',  border: 'border-purple-100' },
  { icon: Shield,      label: '100% Secure Pay',      sub: 'Razorpay encrypted',        color: '#2D6FFF',  bg: 'bg-blue-50',    border: 'border-blue-100' },
  { icon: Headphones,  label: 'WhatsApp Support',     sub: 'Mon–Sat, 9 AM–7 PM',       color: '#25D366',  bg: 'bg-green-50',   border: 'border-green-100' },
  { icon: BadgeCheck,  label: 'Quality Guarantee',    sub: 'Free reprint if faulty',    color: '#10B981',  bg: 'bg-emerald-50', border: 'border-emerald-100' },
]

export default function TrustStrip() {
  return (
    <section className="bg-bg-secondary border-y border-border">
      <div className="container-page py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {TRUST_ITEMS.map(({ icon: Icon, label, sub, color, bg, border }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="flex flex-col items-center text-center gap-3 group"
            >
              <div className={`w-12 h-12 rounded-xl border ${bg} ${border} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-soft`}>
                <Icon size={20} style={{ color }} strokeWidth={1.8} />
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
