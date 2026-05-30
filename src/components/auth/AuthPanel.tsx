'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Printer, Star } from 'lucide-react'

function RegMark({ className }: { className: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
      <line x1="0" y1="18" x2="36" y2="18" stroke="currentColor" strokeWidth="0.5" />
      <line x1="18" y1="0" x2="18" y2="36" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="18" cy="18" r="8" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="18" cy="18" r="2" fill="currentColor" />
    </svg>
  )
}

const STATS = [
  { value: '52+', label: 'Years' },
  { value: '10K+', label: 'Orders' },
  { value: '500+', label: 'Clients' },
]

export default function AuthPanel() {
  return (
    <div
      className="hidden lg:flex flex-col relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #05080f 0%, #080d1a 50%, #060b14 100%)' }}
    >
      {/* Halftone dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          opacity: 0.18,
        }}
        aria-hidden="true"
      />

      {/* Ambient glows */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at top left, rgba(45,111,255,0.12) 0%, transparent 65%)' }} aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at bottom right, rgba(245,197,24,0.08) 0%, transparent 65%)' }} aria-hidden="true" />

      {/* Registration marks — corners */}
      <RegMark className="absolute top-6 left-6 text-white/20" />
      <RegMark className="absolute top-6 right-6 text-white/20" />
      <RegMark className="absolute bottom-6 left-6 text-white/20" />
      <RegMark className="absolute bottom-6 right-6 text-white/20" />

      {/* Giant ghost backdrop text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden select-none pointer-events-none" aria-hidden="true">
        <p
          className="font-display font-bold text-white whitespace-nowrap leading-none"
          style={{ fontSize: 'clamp(80px, 14vw, 180px)', opacity: 0.022, transform: 'rotate(-10deg)' }}
        >
          PRINT
        </p>
      </div>

      {/* Horizontal press rules */}
      {[20, 78].map((top) => (
        <div
          key={top}
          className="absolute left-8 right-8 pointer-events-none"
          style={{
            top: `${top}%`,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), rgba(45,111,255,0.15), rgba(255,255,255,0.06), transparent)',
          }}
          aria-hidden="true"
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-10 justify-between">
        {/* Top: Brand */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #2D6FFF 0%, #1a4fd8 100%)', boxShadow: '0 0 24px rgba(45,111,255,0.4)' }}
            >
              <Printer size={18} className="text-white" strokeWidth={2.2} />
            </div>
            <div>
              <p className="font-display font-bold text-lg text-white leading-none">JPP</p>
              <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase leading-none mt-0.5">Est. 1972</p>
            </div>
          </Link>
        </motion.div>

        {/* Center: Hero copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="max-w-xs"
        >
          {/* CMYK color dots */}
          <div className="flex items-center gap-1 mb-8">
            {[
              'rgba(0,188,212,0.85)',
              'rgba(233,30,99,0.85)',
              'rgba(255,214,10,0.85)',
              'rgba(255,255,255,0.2)',
            ].map((color, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: 18, height: 18,
                  background: color,
                  marginLeft: i > 0 ? -6 : 0,
                  border: '1.5px solid rgba(0,0,0,0.3)',
                  boxShadow: i === 0 ? `0 0 12px ${color}` : undefined,
                }}
              />
            ))}
            <span className="text-[10px] text-white/30 ml-3 tracking-[0.2em] uppercase font-mono">CMYK</span>
          </div>

          <p className="text-xs font-semibold text-brand-blue tracking-[0.25em] uppercase mb-3">
            Rohtak&apos;s Print Studio
          </p>
          <h2 className="font-display font-bold text-4xl text-white leading-[1.1] mb-5">
            Precision<br />
            <span style={{ background: 'linear-gradient(90deg, #2D6FFF, #F5C518)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              on every
            </span>
            <br />
            sheet.
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Jawahar Printing Press has been the trusted print partner for businesses across Haryana since 1972.
            Order online, track live, receive at your door.
          </p>

          {/* Review */}
          <div
            className="mt-8 p-4 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="flex gap-0.5 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} className="text-brand-gold fill-brand-gold" />
              ))}
            </div>
            <p className="text-xs text-white/60 leading-relaxed italic">
              &ldquo;Quality that speaks for itself. 3 years and every order has been perfect.&rdquo;
            </p>
            <p className="text-[11px] text-white/35 mt-2 font-medium">— Vikram Singh, VS Pharma</p>
          </div>
        </motion.div>

        {/* Bottom: Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* CMYK strip */}
          <div className="flex h-1 rounded-full overflow-hidden mb-8">
            {['#00BCD4', '#E91E63', '#FFD60A', 'rgba(255,255,255,0.15)'].map((c, i) => (
              <div key={i} className="flex-1" style={{ background: c }} />
            ))}
          </div>

          <div className="flex gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="font-display font-bold text-2xl text-white">{value}</p>
                <p className="text-[11px] text-white/35 mt-0.5 tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
