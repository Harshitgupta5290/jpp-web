import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import { Home, Search, ArrowRight, Package, Printer } from 'lucide-react'

const QUICK_LINKS = [
  { href: '/catalog',      label: 'Browse Products',    icon: Package,  desc: 'See all printing products' },
  { href: '/order/custom', label: 'Get a Quote',        icon: Printer,  desc: 'Custom printing enquiry' },
  { href: '/track',        label: 'Track Your Order',   icon: Search,   desc: 'Find order by ID' },
  { href: '/contact',      label: 'Contact Us',         icon: Home,     desc: 'Reach our team' },
]

export default function NotFound() {
  return (
    <PageWrapper>
      <section className="bg-white min-h-[calc(100vh-10rem)] flex items-center">
        <div className="container-page py-20">
          <div className="max-w-2xl mx-auto text-center">

            {/* 404 visual */}
            <div className="relative inline-block mb-8">
              <div
                className="text-[10rem] sm:text-[14rem] font-display font-black leading-none select-none"
                style={{
                  background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #EFF6FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                aria-hidden="true"
              >
                404
              </div>
              {/* Printer icon floating over the 404 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-blue-100 shadow-large flex items-center justify-center">
                  <Printer size={36} className="text-brand-blue" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-3">
              Page not found.
            </h1>
            <p className="text-text-secondary text-base leading-relaxed mb-2">
              Looks like this page got lost on the press floor. The link might be broken
              or the page may have moved.
            </p>
            <p className="text-text-tertiary text-sm mb-10">
              Don&apos;t worry — here are some helpful links to get you back on track.
            </p>

            {/* Quick links grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
              {QUICK_LINKS.map(({ href, label, icon: Icon, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-bg-secondary hover:border-brand-blue/30 hover:bg-blue-50 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200 text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center group-hover:border-brand-blue/30 group-hover:bg-white transition-colors">
                    <Icon size={18} className="text-brand-blue" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary leading-tight">{label}</p>
                    <p className="text-[11px] text-text-tertiary mt-0.5">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Primary CTA */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-brand-blue text-white font-semibold text-sm hover:bg-[#1a5ce8] transition-colors shadow-glow-sm group"
            >
              <Home size={16} />
              Back to Home
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <p className="text-xs text-text-tertiary mt-6">
              Error code: 404 · Jawahar Printing Press · Rohtak, Haryana
            </p>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
