'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Clock, Package, PackageCheck, Printer, Truck } from 'lucide-react'
import PageWrapper from '@/components/layout/PageWrapper'

interface TrackPageProps {
  params: { orderId: string }
}

const STATUS_STEPS = [
  { key: 'placed',    icon: CheckCircle,   label: 'Order Placed',     sub: 'We have received your order and advance payment.' },
  { key: 'design',    icon: Printer,       label: 'Design Approved',  sub: 'Your artwork has been verified and approved for print.' },
  { key: 'printing',  icon: Package,       label: 'Printing',         sub: 'Your order is on the press. Quality check in progress.' },
  { key: 'dispatch',  icon: Truck,         label: 'Dispatched',       sub: 'Your package is on its way to your address.' },
  { key: 'delivered', icon: PackageCheck,  label: 'Delivered',        sub: 'Your order has been delivered successfully.' },
]

function getMockStatus(orderId: string): number {
  const hash = orderId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return (hash % 4) + 1
}

export default function TrackPage({ params }: TrackPageProps) {
  const currentStep = getMockStatus(params.orderId)

  return (
    <PageWrapper>
      {/* Header */}
      <section
        className="border-b border-border"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(45,111,255,0.07) 0%, transparent 65%), #0A0F1E',
        }}
      >
        <div className="container-page py-12">
          <motion.div initial={{ y: 16 }} animate={{ y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-xs font-semibold text-brand-blue tracking-[0.25em] uppercase mb-2">
              Order Tracking
            </p>
            <h1 className="font-display font-bold text-text-primary">
              Order{' '}
              <span className="text-brand-blue font-mono text-2xl">#{params.orderId}</span>
            </h1>
            <p className="text-text-secondary mt-1 text-sm">
              Live status of your print order · Updates every 4 hours
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="max-w-2xl mx-auto">

          {/* Status card */}
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-xl overflow-hidden mb-8"
            style={{
              background: 'linear-gradient(135deg, #161D2F 0%, #111827 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            {/* Current status banner */}
            <div
              className="px-6 py-4 flex items-center gap-3"
              style={{ background: 'linear-gradient(90deg, rgba(45,111,255,0.15), rgba(45,111,255,0.05))' }}
            >
              <Clock size={18} className="text-brand-blue" />
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  Current: {STATUS_STEPS[currentStep - 1]?.label ?? 'Processing'}
                </p>
                <p className="text-xs text-text-secondary">
                  {STATUS_STEPS[currentStep - 1]?.sub}
                </p>
              </div>
            </div>

            {/* Steps */}
            <div className="px-6 py-6 space-y-0">
              {STATUS_STEPS.map(({ key, icon: Icon, label, sub }, i) => {
                const stepNum = i + 1
                const isDone = stepNum < currentStep
                const isCurrent = stepNum === currentStep
                const isPending = stepNum > currentStep

                return (
                  <motion.div
                    key={key}
                    initial={{ x: -12 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.15 + i * 0.08, duration: 0.35 }}
                    className="flex gap-4"
                  >
                    {/* Icon column */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isDone
                            ? 'bg-brand-blue/20 border-2 border-brand-blue'
                            : isCurrent
                            ? 'bg-brand-gold/20 border-2 border-brand-gold'
                            : 'bg-bg-secondary border-2 border-border'
                        }`}
                        style={isCurrent ? { boxShadow: '0 0 16px rgba(245,197,24,0.3)' } : isDone ? { boxShadow: '0 0 12px rgba(45,111,255,0.25)' } : {}}
                      >
                        {isDone
                          ? <CheckCircle size={16} className="text-brand-blue" />
                          : isCurrent
                          ? <Icon size={16} className="text-brand-gold" />
                          : <Circle size={16} className="text-border" />
                        }
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div
                          className="w-0.5 flex-1 my-1 min-h-[2rem]"
                          style={{
                            background: isDone
                              ? 'linear-gradient(to bottom, rgba(45,111,255,0.6), rgba(45,111,255,0.2))'
                              : 'rgba(255,255,255,0.06)',
                          }}
                        />
                      )}
                    </div>

                    {/* Text */}
                    <div className={`pb-6 pt-1 ${i === STATUS_STEPS.length - 1 ? 'pb-0' : ''}`}>
                      <p className={`text-sm font-semibold leading-tight ${
                        isDone ? 'text-brand-blue' : isCurrent ? 'text-brand-gold' : 'text-text-secondary'
                      }`}>
                        {label}
                        {isPending && <span className="ml-2 text-[10px] font-normal text-border uppercase tracking-wide">Pending</span>}
                      </p>
                      <p className={`text-xs mt-0.5 leading-relaxed ${isPending ? 'text-border' : 'text-text-secondary'}`}>
                        {sub}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Help card */}
          <motion.div
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="rounded-xl p-5 flex items-start gap-4"
            style={{
              background: 'rgba(37,211,102,0.06)',
              border: '1px solid rgba(37,211,102,0.15)',
            }}
          >
            <div className="w-9 h-9 rounded-full bg-[#25D366]/15 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Need an update?</p>
              <p className="text-xs text-text-secondary mt-0.5 mb-3">
                Chat with us on WhatsApp with your order ID and we&apos;ll reply within 30 minutes.
              </p>
              <a
                href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi! I want an update on my order #${params.orderId}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#25D366] hover:text-[#20b858] transition-colors"
              >
                WhatsApp us →
              </a>
            </div>
          </motion.div>

          <div className="text-center mt-8">
            <Link href="/" className="text-sm text-text-secondary hover:text-brand-blue transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
