'use client'

import Link from 'next/link'
import { Printer, Phone, Mail, MapPin, ArrowUpRight, Shield, Award } from 'lucide-react'

const PRODUCT_LINKS = [
  { href: '/catalog/business-cards',  label: 'Business Cards' },
  { href: '/catalog/brochures',       label: 'Brochures & Pamphlets' },
  { href: '/catalog/banners',         label: 'Banners & Flex' },
  { href: '/catalog/letterheads',     label: 'Letterheads' },
  { href: '/catalog/packaging',       label: 'Packaging Boxes' },
  { href: '/catalog/wedding-cards',   label: 'Wedding Cards' },
  { href: '/catalog/photo-printing',  label: 'Photo Printing' },
  { href: '/catalog/merchandise',     label: 'Branded Merchandise' },
]

const COMPANY_LINKS = [
  { href: '/about',        label: 'About Us' },
  { href: '/clients',      label: 'Our Clients' },
  { href: '/catalog',      label: 'All Products' },
  { href: '/order/custom', label: 'Custom Order' },
  { href: '/track',        label: 'Track Order' },
  { href: '/contact',      label: 'Contact' },
]

const WHATSAPP_URL = `https://wa.me/919999999999?text=${encodeURIComponent('Hi! I want to place a printing order.')}`

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

// ─── Payment Badge ─────────────────────────────────────────────────────────────

function PaymentBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-semibold text-white/70" style={{ minWidth: '60px' }}>
      {label}
    </div>
  )
}

export default function Footer() {
  return (
    <footer style={{ background: '#0A0F1E' }}>
      {/* CTA Banner */}
      <div className="border-b border-white/[0.06]">
        <div className="container-page py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">
                Ready to print?{' '}
                <span className="text-gradient-blue">Get an instant quote.</span>
              </h2>
              <p className="text-slate-400 mt-1.5 text-sm">
                No design? No problem — our team will help create stunning print-ready artwork.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-semibold bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors">
                <WhatsAppIcon size={16} /> Chat Now
              </a>
              <Link href="/order/custom"
                className="flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-semibold bg-brand-blue text-white hover:bg-[#1a5ce8] transition-colors shadow-glow">
                Get Free Quote <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="container-page py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Col 1 — Brand (2 cols wide) */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-md flex items-center justify-center bg-gradient-to-br from-brand-blue to-[#1a4fd8] shadow-glow shrink-0">
                <Printer size={18} className="text-white" strokeWidth={2.2} />
              </div>
              <div className="leading-none">
                <span className="font-display font-bold text-xl text-white block">JPP</span>
                <span className="text-[10px] text-slate-400 tracking-[0.15em] uppercase block -mt-0.5">Est. 1972</span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Jawahar Printing Press — Haryana&apos;s most trusted printing partner for over 52 years. Quality you can feel, speed you can count on.
            </p>

            <div className="space-y-2.5">
              <a href="tel:+919999999999" className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors group">
                <Phone size={14} className="text-brand-blue shrink-0" /> +91 99999 99999
              </a>
              <a href="mailto:info@jawaharprintingpress.com" className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors group">
                <Mail size={14} className="text-brand-blue shrink-0" /> info@jawaharprintingpress.com
              </a>
              <div className="flex items-start gap-2.5 text-sm text-slate-400">
                <MapPin size={14} className="text-brand-blue shrink-0 mt-0.5" />
                <span>Near Old Civil Hospital, Rohtak, Haryana 124001</span>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2 pt-1">
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-8 h-8 rounded-md flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/10 border border-[#25D366]/20 transition-all">
                <WhatsAppIcon size={14} />
              </a>
            </div>

            {/* Certifications / badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-medium text-white/60">
                <Shield size={11} className="text-brand-blue" /> Secure Payment
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-medium text-white/60">
                <Award size={11} className="text-amber-400" /> 52 Years Quality
              </div>
            </div>
          </div>

          {/* Col 2 — Products */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white tracking-widest uppercase">Products</h3>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-400 hover:text-white transition-colors hover:translate-x-0.5 inline-block transform duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Company */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white tracking-widest uppercase">Company</h3>
            <ul className="space-y-2">
              {COMPANY_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-400 hover:text-white transition-colors hover:translate-x-0.5 inline-block transform duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Map + hours */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white tracking-widest uppercase">Find Us</h3>
            <div className="rounded-xl overflow-hidden border border-white/10 aspect-video bg-white/5">
              <iframe
                title="Jawahar Printing Press Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.5177!2d76.5748!3d28.8955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDUzJzQ0LjAiTiA3NsKwMzQnMjkuMyJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%" height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-white/50 font-medium uppercase tracking-wide">Business Hours</p>
              <p className="text-sm text-slate-300">Mon–Sat: 9 AM – 7 PM IST</p>
              <p className="text-sm text-slate-500">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <div className="border-t border-white/[0.06]">
        <div className="container-page py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">Secure payments powered by</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <PaymentBadge label="Razorpay" />
              <PaymentBadge label="UPI" />
              <PaymentBadge label="Visa" />
              <PaymentBadge label="Mastercard" />
              <PaymentBadge label="Net Banking" />
              <PaymentBadge label="EMI" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Jawahar Printing Press. All rights reserved. GST: 06AABCJ1234M1Z5
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="text-xs text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/refunds" className="text-xs text-slate-500 hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
