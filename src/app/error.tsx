'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import { AlertTriangle, RefreshCw, Home, ArrowRight, MessageCircle } from 'lucide-react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

const WHATSAPP_URL = `https://wa.me/919999999999?text=${encodeURIComponent('Hi! I encountered an error on your website. Can you help?')}`

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[JPP Error]', error)
  }, [error])

  return (
    <PageWrapper>
      <section className="bg-white min-h-[calc(100vh-10rem)] flex items-center">
        <div className="container-page py-20">
          <div className="max-w-xl mx-auto text-center">

            {/* Error visual */}
            <div className="relative inline-block mb-8">
              <div
                className="text-[10rem] sm:text-[14rem] font-display font-black leading-none select-none"
                style={{
                  background: 'linear-gradient(135deg, #FEF2F2 0%, #FECACA 50%, #FEF2F2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                aria-hidden="true"
              >
                500
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-red-100 shadow-large flex items-center justify-center">
                  <AlertTriangle size={36} className="text-error" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-3">
              Something went wrong.
            </h1>
            <p className="text-text-secondary text-base leading-relaxed mb-2">
              We hit an unexpected error on our end. Our team has been notified and we&apos;re working on it.
            </p>
            <p className="text-text-tertiary text-sm mb-10">
              Please try again or reach us on WhatsApp if the issue persists.
            </p>

            {/* Error digest (for debugging) */}
            {error.digest && (
              <div className="mb-8 p-3 rounded-xl bg-bg-secondary border border-border inline-block">
                <p className="text-xs text-text-tertiary font-mono">
                  Error ID: <span className="text-text-secondary">{error.digest}</span>
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <button
                onClick={reset}
                className="flex items-center gap-2 h-12 px-6 rounded-xl bg-brand-blue text-white font-semibold text-sm hover:bg-[#1a5ce8] transition-colors shadow-glow-sm group"
              >
                <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                Try Again
              </button>
              <Link
                href="/"
                className="flex items-center gap-2 h-12 px-6 rounded-xl bg-white border border-border text-text-primary font-semibold text-sm hover:border-brand-blue/30 hover:bg-blue-50 transition-colors group"
              >
                <Home size={16} />
                Back to Home
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* WhatsApp support */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#25D366] font-semibold hover:underline"
            >
              <MessageCircle size={15} />
              Report this on WhatsApp
            </a>

            <p className="text-xs text-text-tertiary mt-6">
              Error code: 500 · Jawahar Printing Press · Rohtak, Haryana
            </p>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
