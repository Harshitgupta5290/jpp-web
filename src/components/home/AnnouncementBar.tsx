'use client'

import { useState, useEffect } from 'react'
import { X, ChevronRight, Zap, Truck, Tag } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const ANNOUNCEMENTS = [
  {
    id: 1,
    icon: Tag,
    text: 'New customer offer: Use code ',
    highlight: 'FIRST10',
    suffix: ' for 10% off your first order',
    href: '/order/custom',
    cta: 'Claim Now',
  },
  {
    id: 2,
    icon: Truck,
    text: 'Free pan-India delivery on orders above ',
    highlight: '₹999',
    suffix: ' — same week turnaround guaranteed',
    href: '/catalog',
    cta: 'Browse Products',
  },
  {
    id: 3,
    icon: Zap,
    text: '⚡ Same-day dispatch for orders placed before ',
    highlight: '12 PM',
    suffix: ' — Mon to Sat',
    href: '/order/custom',
    cta: 'Order Now',
  },
]

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!visible) return
    const t = setInterval(() => setCurrent((c) => (c + 1) % ANNOUNCEMENTS.length), 4000)
    return () => clearInterval(t)
  }, [visible])

  if (!visible) return null

  const ann = ANNOUNCEMENTS[current]!

  return (
    <div
      className="relative w-full z-50 overflow-hidden"
      style={{ background: 'linear-gradient(90deg, #1a50e0 0%, #2D6FFF 50%, #1a50e0 100%)', height: '2.5rem' }}
    >
      {/* Subtle shimmer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
          animation: 'shimmer 3s linear infinite',
          backgroundSize: '200% 100%',
        }}
        aria-hidden="true"
      />

      <div className="container-page h-full flex items-center justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2 text-white text-xs sm:text-sm font-medium"
          >
            {ann.icon && <ann.icon size={13} className="shrink-0 opacity-90" />}
            <span className="hidden sm:inline">
              {ann.text}
              <strong className="bg-white/20 px-1.5 py-0.5 rounded text-white font-bold mx-0.5">{ann.highlight}</strong>
              {ann.suffix}
            </span>
            <span className="sm:hidden">{ann.highlight} {ann.suffix.slice(0, 30)}</span>
            <Link
              href={ann.href}
              className="hidden md:flex items-center gap-0.5 text-white/90 hover:text-white underline underline-offset-2 text-xs font-semibold ml-1 transition-colors"
            >
              {ann.cta} <ChevronRight size={12} />
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex gap-1.5">
            {ANNOUNCEMENTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-4' : 'bg-white/40'}`}
                aria-label={`Announcement ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setVisible(false)}
            className="text-white/70 hover:text-white transition-colors touch-target w-7 h-7"
            aria-label="Dismiss announcement"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
