'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Monitor, Layers, Settings, Printer, Sparkles, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const STEPS = [
  {
    num: '01',
    icon: Monitor,
    title: 'Pre-Press Design',
    subtitle: 'Artwork Preparation',
    description: 'Your artwork is colour-separated into CMYK channels. Our pre-press team checks bleed margins (3mm), resolution (300 DPI minimum), and colour profiles. We flag any issues before a single drop of ink is used.',
    specs: ['300 DPI Resolution', '3mm Bleed Tolerance', 'ICC Colour Profiles', 'PDF/X-4 Standard'],
    color: '#2D6FFF',
    glow: 'rgba(45,111,255,0.3)',
  },
  {
    num: '02',
    icon: Layers,
    title: 'Film & Plate Making',
    subtitle: 'CMYK Separation',
    description: 'Computer-to-Plate (CtP) technology exposes your digital file directly onto aluminium offset plates — one for each of Cyan, Magenta, Yellow, and Black. Eliminates film step for sharper dots.',
    specs: ['CtP Technology', '4-Colour CMYK Process', 'Aluminium Plates', 'Stochastic Screening'],
    color: '#8B5CF6',
    glow: 'rgba(139,92,246,0.3)',
  },
  {
    num: '03',
    icon: Settings,
    title: 'Press Setup & Calibration',
    subtitle: 'Ink Registration',
    description: 'Plates are mounted on our Heidelberg offset press. Ink density, registration marks, and water balance are calibrated. We print a proof run and compare against your approved colour target before production starts.',
    specs: ['Heidelberg Press', 'Ink Density Control', 'Registration Accuracy ±0.1mm', 'Colour Proof Check'],
    color: '#F5A500',
    glow: 'rgba(245,165,0,0.3)',
  },
  {
    num: '04',
    icon: Printer,
    title: 'High-Volume Printing',
    subtitle: 'Offset Production',
    description: 'Production run at up to 15,000 sheets per hour. Each sheet goes through all 4 colour units in one pass. Automated ink pumping and online quality sensors monitor every sheet for density and registration.',
    specs: ['15,000 sheets/hour', 'Inline Colour Sensors', 'Auto Ink Pump', 'UV Curing Option'],
    color: '#10B981',
    glow: 'rgba(16,185,129,0.3)',
  },
  {
    num: '05',
    icon: Sparkles,
    title: 'Finishing & Lamination',
    subtitle: 'Post-Press Enhancement',
    description: 'Printed sheets pass through lamination (matte, glossy, or soft-touch), UV spot coating, die-cutting, folding, stitching, or binding — depending on your product. This is where the luxury look and feel comes from.',
    specs: ['Matte / Glossy / Soft-Touch', 'Spot UV Coating', 'Die Cutting & Folding', 'Gold / Silver Foil'],
    color: '#EC4899',
    glow: 'rgba(236,72,153,0.3)',
  },
  {
    num: '06',
    icon: CheckCircle,
    title: 'QC & Dispatch',
    subtitle: 'Quality Control',
    description: "Every job is inspected by our QC team — colour accuracy, cutting precision, lamination quality. Only approved items are packed and handed to our logistics partner. You're notified with a tracking link the moment it ships.",
    specs: ['100-Point QC Checklist', 'Densitometer Check', 'Safe Packaging', 'Live Order Tracking'],
    color: '#0EA5E9',
    glow: 'rgba(14,165,233,0.3)',
  },
]

function StepCard({ step, index }: { step: typeof STEPS[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative card-dark card-dark-hover p-6 flex flex-col gap-4"
    >
      {/* Step number — top right */}
      <span className="absolute top-4 right-5 font-mono font-bold text-4xl leading-none pointer-events-none select-none" style={{ color: `${step.color}15` }}>
        {step.num}
      </span>

      {/* Icon circle */}
      <div className="relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${step.color}15`, border: `1px solid ${step.color}30`, boxShadow: `0 0 20px ${step.glow}` }}>
        <step.icon size={22} style={{ color: step.color }} strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: step.color }}>{step.subtitle}</p>
        <h3 className="font-display font-bold text-lg text-white leading-snug mb-2">{step.title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
      </div>

      {/* Tech specs */}
      <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-white/[0.06]">
        {step.specs.map((s) => (
          <span key={s} className="text-[10px] px-2 py-0.5 rounded font-mono font-medium"
            style={{ background: `${step.color}12`, color: `${step.color}cc`, border: `1px solid ${step.color}20` }}>
            {s}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function PrintingProcess() {
  return (
    <section className="relative section-lg overflow-hidden" style={{ background: '#0A0F1E' }}>
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" aria-hidden="true" />

      {/* Blue ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(45,111,255,0.1) 0%, transparent 70%)' }} aria-hidden="true" />

      <div className="container-page relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold mb-5"
            style={{ background: 'rgba(45,111,255,0.1)', borderColor: 'rgba(45,111,255,0.25)', color: '#60a5fa' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse-slow" />
            Inside the Press
          </div>

          <h2 className="font-display font-bold text-white">
            From raw paper to{' '}
            <span className="text-gradient-blue">perfect print</span>
            <br />
            <span className="text-slate-300 text-3xl">— inside our 6-step process.</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-base leading-relaxed">
            Every order at Jawahar Printing Press goes through the same precision workflow used by top commercial printers —
            but with the personal attention of a 52-year-old family press.
          </p>

          {/* Tech spec strip */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {[
              { label: '300 DPI', desc: 'Output resolution' },
              { label: 'CMYK', desc: 'Colour process' },
              { label: '±0.1mm', desc: 'Registration accuracy' },
              { label: 'ISO 12647', desc: 'Print standard' },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5">
                <span className="font-mono font-bold text-sm text-white">{label}</span>
                <span className="text-xs text-slate-400">{desc}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STEPS.map((step, i) => (
            <StepCard key={step.num} step={step} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 text-center"
        >
          <p className="text-slate-300 text-lg font-medium">Ready to experience print perfection?</p>
          <Link href="/catalog"
            className="flex items-center gap-2 h-11 px-6 rounded-xl bg-brand-blue text-white font-semibold text-sm hover:bg-[#1a5ce8] transition-colors shadow-glow group">
            Start Your Order <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
