'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useHasMounted } from '@/hooks/useHasMounted'

// ─── Ink Canvas ───────────────────────────────────────────────────────────────

interface InkDrop { x: number; y: number; r: number; maxR: number; alpha: number; color: string; speed: number }

function InkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const ctx = el.getContext('2d'); if (!ctx) return
    const canvas: HTMLCanvasElement = el
    const context: CanvasRenderingContext2D = ctx
    const drops: InkDrop[] = []
    let animId: number, w = 0, h = 0
    const COLORS = ['rgba(45,111,255,', 'rgba(29,78,216,', 'rgba(245,197,24,', 'rgba(96,165,250,']
    const resize = () => { w = canvas.offsetWidth; h = canvas.offsetHeight; canvas.width = w; canvas.height = h }
    const spawn = () => drops.push({ x: Math.random() * w, y: Math.random() * h, r: 0, maxR: 100 + Math.random() * 140, alpha: 0.13 + Math.random() * 0.1, color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? COLORS[0]!, speed: 0.5 + Math.random() * 0.7 })
    const draw = () => {
      context.clearRect(0, 0, w, h)
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i]!; d.r += d.speed; d.alpha *= 0.983
        const g = context.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r)
        g.addColorStop(0, `${d.color}${d.alpha.toFixed(3)})`); g.addColorStop(0.5, `${d.color}${(d.alpha * 0.4).toFixed(3)})`); g.addColorStop(1, `${d.color}0)`)
        context.beginPath(); context.arc(d.x, d.y, d.r, 0, Math.PI * 2); context.fillStyle = g; context.fill()
        if (d.r >= d.maxR || d.alpha < 0.001) drops.splice(i, 1)
      }
      animId = requestAnimationFrame(draw)
    }
    resize(); window.addEventListener('resize', resize, { passive: true })
    for (let i = 0; i < 5; i++) spawn()
    const t = setInterval(spawn, 2000); draw()
    return () => { cancelAnimationFrame(animId); clearInterval(t); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none z-[2]" aria-hidden="true" />
}

// ─── Printing Press SVG Background ───────────────────────────────────────────

function PrintBG() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-[1]"
      viewBox="0 0 1440 820"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {/* Halftone — visible dots */}
        <pattern id="ht" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="11" cy="11" r="1.6" fill="rgba(255,255,255,0.13)" />
        </pattern>
        {/* Blueprint grid */}
        <pattern id="bg" width="72" height="72" patternUnits="userSpaceOnUse">
          <path d="M72 0H0V72" fill="none" stroke="rgba(45,111,255,0.12)" strokeWidth="0.6" />
          <line x1="36" y1="0" x2="36" y2="72" stroke="rgba(45,111,255,0.05)" strokeWidth="0.4" strokeDasharray="3 9" />
          <line x1="0" y1="36" x2="72" y2="36" stroke="rgba(45,111,255,0.05)" strokeWidth="0.4" strokeDasharray="3 9" />
        </pattern>

        {/* Left roller gradient */}
        <linearGradient id="rl" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#0a1628" />
          <stop offset="35%"  stopColor="#122040" />
          <stop offset="65%"  stopColor="#1a3060" />
          <stop offset="100%" stopColor="#0d1a30" />
        </linearGradient>
        {/* Right roller gradient */}
        <linearGradient id="rr" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#181008" />
          <stop offset="35%"  stopColor="#2a1c08" />
          <stop offset="65%"  stopColor="#3a2808" />
          <stop offset="100%" stopColor="#1e1408" />
        </linearGradient>
        {/* CMYK bar */}
        <linearGradient id="cmyk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#00BCD4" stopOpacity="0.9" />
          <stop offset="25%"  stopColor="#E91E63" stopOpacity="0.9" />
          <stop offset="50%"  stopColor="#FFD60A" stopOpacity="0.9" />
          <stop offset="75%"  stopColor="#263238" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#00BCD4" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* ── Base dot + grid layers ── */}
      <rect width="1440" height="820" fill="url(#ht)" />
      <rect width="1440" height="820" fill="url(#bg)" />

      {/* ══ LEFT CYLINDER ══ */}
      {/* Main body */}
      <rect x="-4" y="60" width="110" height="700" rx="6" fill="url(#rl)" />
      {/* Highlight stripe */}
      <rect x="74" y="60" width="6" height="700" fill="rgba(255,255,255,0.07)" />
      {/* Shadow edge */}
      <rect x="0" y="60" width="8" height="700" fill="rgba(0,0,0,0.3)" />
      {/* Horizontal press lines */}
      {Array.from({ length: 14 }).map((_, i) => (
        <line key={i} x1="0" y1={60 + i * 50} x2="106" y2={60 + i * 50} stroke="rgba(45,111,255,0.22)" strokeWidth="0.7" />
      ))}
      {/* Cylinder caps */}
      <ellipse cx="53" cy="60"  rx="53" ry="14" fill="#0d1828" stroke="rgba(45,111,255,0.4)" strokeWidth="1.2" />
      <ellipse cx="53" cy="760" rx="53" ry="14" fill="#0d1828" stroke="rgba(45,111,255,0.3)" strokeWidth="1" />
      {/* Ink color band on roller */}
      <rect x="0" y="355" width="110" height="110" fill="rgba(45,111,255,0.15)" />
      <rect x="0" y="355" width="110" height="2"   fill="rgba(45,111,255,0.5)" />
      <rect x="0" y="463" width="110" height="2"   fill="rgba(45,111,255,0.5)" />

      {/* ══ RIGHT CYLINDER ══ */}
      <rect x="1334" y="60" width="110" height="700" rx="6" fill="url(#rr)" />
      <rect x="1334" y="60" width="8" height="700" fill="rgba(255,255,255,0.06)" />
      <rect x="1436" y="60" width="8" height="700" fill="rgba(0,0,0,0.3)" />
      {Array.from({ length: 14 }).map((_, i) => (
        <line key={i} x1="1334" y1={60 + i * 50} x2="1440" y2={60 + i * 50} stroke="rgba(245,197,24,0.2)" strokeWidth="0.7" />
      ))}
      <ellipse cx="1387" cy="60"  rx="53" ry="14" fill="#180e04" stroke="rgba(245,197,24,0.38)" strokeWidth="1.2" />
      <ellipse cx="1387" cy="760" rx="53" ry="14" fill="#180e04" stroke="rgba(245,197,24,0.28)" strokeWidth="1" />
      <rect x="1334" y="355" width="110" height="110" fill="rgba(245,197,24,0.12)" />
      <rect x="1334" y="355" width="110" height="2"   fill="rgba(245,197,24,0.45)" />
      <rect x="1334" y="463" width="110" height="2"   fill="rgba(245,197,24,0.45)" />

      {/* ══ TOP PRESS BEAM ══ */}
      <rect x="0" y="0" width="1440" height="8" fill="rgba(45,111,255,0.5)" />
      <rect x="106" y="8" width="1228" height="52" fill="rgba(45,111,255,0.06)" />
      <line x1="106" y1="60" x2="1334" y2="60" stroke="rgba(45,111,255,0.25)" strokeWidth="1" />

      {/* ══ BOTTOM PRESS BEAM ══ */}
      <rect x="0" y="812" width="1440" height="8" fill="rgba(45,111,255,0.4)" />
      <rect x="106" y="760" width="1228" height="52" fill="rgba(45,111,255,0.04)" />
      <line x1="106" y1="760" x2="1334" y2="760" stroke="rgba(45,111,255,0.2)" strokeWidth="1" />

      {/* ══ PRINT RULES (horizontal dashed baselines) ══ */}
      {[155, 270, 390, 510, 630, 680].map((y) => (
        <line key={y} x1="120" y1={y} x2="1320" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="0.7" strokeDasharray="8 14" />
      ))}

      {/* ══ REGISTRATION CROSSHAIRS — 4 corners ══ */}
      {([
        [60, 42], [1380, 42], [60, 778], [1380, 778],
      ] as [number, number][]).map(([cx, cy]) => (
        <g key={`${cx}-${cy}`} stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" fill="none">
          <line x1={cx - 20} y1={cy} x2={cx + 20} y2={cy} />
          <line x1={cx} y1={cy - 20} x2={cx} y2={cy + 20} />
          <circle cx={cx} cy={cy} r="11" />
          <circle cx={cx} cy={cy} r="3" fill="rgba(255,255,255,0.55)" stroke="none" />
        </g>
      ))}

      {/* Mid-edge reg marks */}
      {([
        [113, 410, 'rgba(45,111,255,0.7)'],
        [1327, 410, 'rgba(245,197,24,0.65)'],
      ] as [number, number, string][]).map(([cx, cy, c]) => (
        <g key={`mid-${cx}`} stroke={c} strokeWidth="0.7" fill="none">
          <line x1={cx - 16} y1={cy} x2={cx + 16} y2={cy} />
          <line x1={cx} y1={cy - 16} x2={cx} y2={cy + 16} />
          <circle cx={cx} cy={cy} r="9" />
        </g>
      ))}

      {/* ══ CMYK CIRCLES — top-left ══ */}
      <circle cx="200" cy="170" r="55" fill="rgba(0,188,212,0.08)"  stroke="rgba(0,188,212,0.55)"  strokeWidth="1.5" />
      <circle cx="232" cy="198" r="55" fill="rgba(233,30,99,0.07)"  stroke="rgba(233,30,99,0.5)"   strokeWidth="1.5" />
      <circle cx="216" cy="228" r="55" fill="rgba(255,214,10,0.06)" stroke="rgba(255,214,10,0.45)" strokeWidth="1.5" />
      <text x="155" y="300" fontSize="9" fill="rgba(255,255,255,0.3)" fontFamily="monospace" letterSpacing="3">CMYK REG</text>

      {/* ══ CMYK CIRCLES — bottom-right ══ */}
      <circle cx="1258" cy="648" r="46" fill="rgba(0,188,212,0.07)"  stroke="rgba(0,188,212,0.4)"  strokeWidth="1.2" />
      <circle cx="1286" cy="672" r="46" fill="rgba(233,30,99,0.06)"  stroke="rgba(233,30,99,0.36)" strokeWidth="1.2" />
      <circle cx="1272" cy="698" r="46" fill="rgba(255,214,10,0.05)" stroke="rgba(255,214,10,0.32)" strokeWidth="1.2" />

      {/* ══ RULER TICKS — top ══ */}
      {Array.from({ length: 44 }).map((_, i) => (
        <line key={i}
          x1={112 + i * 27.5} y1="8"
          x2={112 + i * 27.5} y2={i % 4 === 0 ? 26 : 18}
          stroke="rgba(255,255,255,0.3)" strokeWidth="0.6"
        />
      ))}
      {/* Ruler numbers */}
      {Array.from({ length: 11 }).map((_, i) => (
        <text key={i} x={112 + i * 110} y="35" fontSize="7.5" fill="rgba(255,255,255,0.18)" fontFamily="monospace">
          {i * 10}
        </text>
      ))}

      {/* ══ RULER TICKS — bottom ══ */}
      {Array.from({ length: 44 }).map((_, i) => (
        <line key={i}
          x1={112 + i * 27.5} y1="812"
          x2={112 + i * 27.5} y2={i % 4 === 0 ? 794 : 802}
          stroke="rgba(255,255,255,0.22)" strokeWidth="0.6"
        />
      ))}

      {/* ══ GHOST "1972" BACKDROP ══ */}
      <text x="720" y="570" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="900" fontSize="340" fill="rgba(255,255,255,0.03)" letterSpacing="-6" style={{ userSelect: 'none' }}>
        1972
      </text>

      {/* ══ PANTONE-STYLE SWATCHES — left side ══ */}
      {['#2D6FFF', '#1a4fd8', '#0d3bb5', '#072d96'].map((c, i) => (
        <rect key={c} x="106" y={300 + i * 36} width="18" height="34" fill={c} opacity={0.6 - i * 0.1} />
      ))}
      <text x="108" y="446" fontSize="7" fill="rgba(255,255,255,0.25)" fontFamily="monospace">BLUE</text>

      {/* ══ PANTONE-STYLE SWATCHES — right side ══ */}
      {['#F5C518', '#d4a80a', '#b48c00', '#927200'].map((c, i) => (
        <rect key={c} x="1316" y={300 + i * 36} width="18" height="34" fill={c} opacity={0.55 - i * 0.09} />
      ))}
      <text x="1310" y="446" fontSize="7" fill="rgba(255,255,255,0.22)" fontFamily="monospace">GOLD</text>

      {/* ══ BOTTOM CMYK COLOR-PROOF STRIP ══ */}
      <rect x="106" y="796" width="1228" height="12" fill="url(#cmyk)" rx="1" />
      <text x="106" y="816" fontSize="7" fill="rgba(255,255,255,0.3)" fontFamily="monospace" letterSpacing="2">COLOR PROOF STRIP · JPP · 300 DPI</text>

      {/* ══ "DPI / SPECIFICATIONS" label top-right ══ */}
      <text x="1334" y="80"  fontSize="7.5" fill="rgba(255,255,255,0.2)" fontFamily="monospace" textAnchor="end">300 DPI</text>
      <text x="1334" y="90"  fontSize="7"   fill="rgba(255,255,255,0.13)" fontFamily="monospace" textAnchor="end">CMYK · BLEED 3mm</text>
      <text x="1334" y="100" fontSize="7"   fill="rgba(255,255,255,0.11)" fontFamily="monospace" textAnchor="end">JPP OFFSET PRESS v2</text>
    </svg>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '52+',  label: 'Years of Excellence', gradient: 'linear-gradient(135deg, #F5C518 0%, #ffd94d 100%)', glow: 'rgba(245,197,24,0.2)',  border: 'rgba(245,197,24,0.25)' },
  { value: '10K+', label: 'Orders Delivered',    gradient: 'linear-gradient(135deg, #2D6FFF 0%, #60a5fa 100%)', glow: 'rgba(45,111,255,0.2)',  border: 'rgba(45,111,255,0.25)' },
  { value: '500+', label: 'Happy Businesses',    gradient: 'linear-gradient(135deg, #10B981 0%, #6ee7b7 100%)', glow: 'rgba(16,185,129,0.2)',  border: 'rgba(16,185,129,0.25)' },
  { value: '24hr', label: 'Express Turnaround',  gradient: 'linear-gradient(135deg, #a855f7 0%, #d8b4fe 100%)', glow: 'rgba(168,85,247,0.2)', border: 'rgba(168,85,247,0.25)' },
]

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function HeroSection() {
  const mounted = useHasMounted()

  return (
    <section className="relative min-h-[calc(100dvh-4rem)] flex items-center overflow-hidden" style={{ background: '#060b16' }}>

      {/* Layer 1 — SVG press scene */}
      <PrintBG />

      {/* Layer 2 — ink drop canvas */}
      <InkCanvas />

      {/* Layer 3 — center-focused vignette (lighter at edges so SVG shows) */}
      <div
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{ background: 'radial-gradient(ellipse 70% 75% at 50% 48%, transparent 0%, rgba(6,11,22,0.55) 55%, rgba(6,11,22,0.82) 85%, rgba(6,11,22,0.92) 100%)' }}
        aria-hidden="true"
      />

      {/* Layer 4 — top/bottom fade */}
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none z-[3]" style={{ background: 'linear-gradient(to bottom, rgba(6,11,22,0.7), transparent)' }} aria-hidden="true" />
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-[3]" style={{ background: 'linear-gradient(to bottom, transparent, #060b16)' }} aria-hidden="true" />

      {/* Content */}
      <div className="container-page relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center">

          <motion.div
            initial={mounted ? { opacity: 0, y: -10 } : false}
            animate={mounted ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-brand-blue text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse-slow" />
            Now delivering pan-India — same week turnaround
          </motion.div>

          <motion.h1
            initial={mounted ? { opacity: 0, y: 24 } : false}
            animate={mounted ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="font-display font-bold leading-[1.1] text-text-primary"
          >
            Print with{' '}
            <span className="text-gradient-blue">Precision.</span>
            <br />
            Deliver Across{' '}
            <span className="relative inline-block">
              India.
              <motion.span
                initial={mounted ? { scaleX: 0 } : false}
                animate={mounted ? { scaleX: 1 } : undefined}
                transition={{ delay: 0.7, duration: 0.5, ease: 'easeOut' }}
                className="absolute -bottom-1 left-0 right-0 h-1 bg-brand-gold rounded-full origin-left"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={mounted ? { opacity: 0, y: 16 } : false}
            animate={mounted ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.35 }}
            className="mt-6 text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            From 100 business cards to 100,000 brochures — Jawahar Printing Press has been
            Haryana&apos;s most trusted print partner since 1972. Bulk pricing, fast dispatch,
            and design support included.
          </motion.p>

          <motion.div
            initial={mounted ? { opacity: 0, y: 16 } : false}
            animate={mounted ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10"
          >
            <Link href="/catalog">
              <Button variant="primary" size="lg" icon={<ArrowRight size={18} />} iconPosition="right" className="w-full sm:w-auto">
                Order Now
              </Button>
            </Link>
            <Link href="/order/custom">
              <Button variant="secondary" size="lg" icon={<Zap size={18} />} className="w-full sm:w-auto">
                Get Instant Quote
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={mounted ? { opacity: 0, y: 24 } : false}
            animate={mounted ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-14"
          >
            {STATS.map(({ value, label, gradient, glow, border }) => (
              <div
                key={label}
                className="relative flex flex-col items-center justify-center py-6 px-4 rounded-xl overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${border}`,
                  boxShadow: `0 0 32px ${glow}, inset 0 1px 0 rgba(255,255,255,0.06)`,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${glow.replace('0.2', '0.6')} 0%, transparent 70%)` }} aria-hidden="true" />
                <p className="relative font-display font-bold text-5xl md:text-6xl bg-clip-text text-transparent leading-none" style={{ backgroundImage: gradient }}>
                  {value}
                </p>
                <p className="relative text-xs text-text-secondary mt-2 text-center leading-tight font-medium">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
