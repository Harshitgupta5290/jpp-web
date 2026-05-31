'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Clock, Package, PackageCheck, Printer, Truck, ArrowLeft, MessageCircle } from 'lucide-react'
import PageWrapper from '@/components/layout/PageWrapper'

interface TrackPageProps {
  params: { orderId: string }
}

const STATUS_STEPS = [
  { key: 'placed',    icon: CheckCircle,  label: 'Order Placed',    sub: 'We have received your order and advance payment.' },
  { key: 'design',    icon: Printer,      label: 'Design Approved', sub: 'Your artwork has been verified and approved for print.' },
  { key: 'printing',  icon: Package,      label: 'Printing',        sub: 'Your order is on the press. Quality check in progress.' },
  { key: 'dispatch',  icon: Truck,        label: 'Dispatched',      sub: 'Your package is on its way to your address.' },
  { key: 'delivered', icon: PackageCheck, label: 'Delivered',       sub: 'Your order has been delivered successfully.' },
]

function getMockStatus(orderId: string): number {
  const hash = orderId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return (hash % 4) + 1
}

export default function TrackPage({ params }: TrackPageProps) {
  const currentStep = getMockStatus(params.orderId)
  const currentStatusLabel = STATUS_STEPS[currentStep - 1]?.label ?? 'Processing'

  const progressPercent = Math.round(((currentStep - 1) / (STATUS_STEPS.length - 1)) * 100)

  return (
    <PageWrapper>
      {/* Page header */}
      <section className="bg-white border-b border-border">
        <div className="container-page py-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/track" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-blue transition-colors mb-4">
              <ArrowLeft size={14} /> Back to track order
            </Link>
            <span className="section-label">Order Tracking</span>
            <div className="flex flex-col sm:flex-row sm:items-end gap-2 mt-1">
              <h1 className="font-display font-bold text-text-primary">
                Order{' '}
                <span className="font-mono text-brand-blue">#{params.orderId}</span>
              </h1>
              <span className="sm:mb-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                <Clock size={11} /> {currentStatusLabel}
              </span>
            </div>
            <p className="text-text-secondary text-sm mt-1">Live status · Updates every 4 hours</p>
          </motion.div>
        </div>
      </section>

      <section className="bg-bg-secondary min-h-screen">
        <div className="container-page py-10">
          <div className="max-w-2xl mx-auto space-y-5">

            {/* Progress bar card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl border border-border shadow-soft p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-text-primary">Overall Progress</p>
                <span className="font-price font-bold text-brand-blue">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-brand-blue to-blue-400"
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-text-tertiary">Order Placed</span>
                <span className="text-xs text-text-tertiary">Delivered</span>
              </div>
            </motion.div>

            {/* Status steps card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-border shadow-soft p-6"
            >
              <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-5">Status Timeline</p>

              <div className="space-y-0">
                {STATUS_STEPS.map(({ key, icon: Icon, label, sub }, i) => {
                  const stepNum = i + 1
                  const isDone    = stepNum < currentStep
                  const isCurrent = stepNum === currentStep
                  const isPending = stepNum > currentStep

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.07, duration: 0.3 }}
                      className="flex gap-4"
                    >
                      {/* Icon + connector */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                          isDone    ? 'bg-blue-50 border-brand-blue' :
                          isCurrent ? 'bg-amber-50 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]' :
                                      'bg-bg-secondary border-border'
                        }`}>
                          {isDone
                            ? <CheckCircle size={18} className="text-brand-blue" />
                            : isCurrent
                            ? <Icon size={18} className="text-amber-500" />
                            : <Circle size={18} className="text-text-tertiary" />
                          }
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div className={`w-0.5 flex-1 my-1 min-h-[2rem] rounded-full ${isDone ? 'bg-brand-blue/30' : 'bg-border'}`} />
                        )}
                      </div>

                      {/* Text */}
                      <div className={`pb-5 pt-2 ${i === STATUS_STEPS.length - 1 ? 'pb-0' : ''}`}>
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-semibold leading-tight ${
                            isDone ? 'text-brand-blue' : isCurrent ? 'text-amber-600' : 'text-text-tertiary'
                          }`}>
                            {label}
                          </p>
                          {isCurrent && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wide">
                              In Progress
                            </span>
                          )}
                          {isDone && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-brand-blue border border-blue-100 uppercase tracking-wide">
                              Done
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-0.5 leading-relaxed ${isPending ? 'text-text-tertiary' : 'text-text-secondary'}`}>
                          {sub}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* WhatsApp help card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl border border-[#25D366]/20 p-5 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center shrink-0">
                <MessageCircle size={18} className="text-[#25D366]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">Need a faster update?</p>
                <p className="text-xs text-text-secondary mt-0.5 mb-3">
                  Chat with us on WhatsApp with your order ID — we reply within 30 minutes.
                </p>
                <a
                  href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi! I want an update on my order #${params.orderId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 text-xs font-semibold hover:bg-[#25D366]/20 transition-colors"
                >
                  WhatsApp us →
                </a>
              </div>
            </motion.div>

            <div className="text-center pt-2">
              <Link href="/" className="text-sm text-text-secondary hover:text-brand-blue transition-colors">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
