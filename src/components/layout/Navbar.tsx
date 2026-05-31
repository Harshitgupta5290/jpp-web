'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Menu, X, Phone, Package, Info, Mail, MapPin,
  ChevronRight, Printer, User, LogIn, Search, ChevronDown,
  CreditCard, BookOpen, Megaphone, FileText, Heart, ImageIcon,
  Shirt, Layers, ArrowRight,
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { useScrolled } from '@/hooks/useScrolled'
import Button from '@/components/ui/Button'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919999999999'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I want to place a printing order.')}`

const PRODUCT_CATEGORIES = [
  { slug: 'business-cards',  name: 'Business Cards',        icon: CreditCard, desc: 'Matte, glossy, spot UV', from: '₹399' },
  { slug: 'brochures',       name: 'Brochures & Pamphlets', icon: BookOpen,   desc: 'Tri-fold, bi-fold, Z-fold', from: '₹799' },
  { slug: 'banners',         name: 'Banners & Flex',        icon: Megaphone,  desc: 'Outdoor, vinyl, canvas', from: '₹299' },
  { slug: 'packaging',       name: 'Packaging Boxes',       icon: Package,    desc: 'Custom branded boxes', from: '₹2,499' },
  { slug: 'letterheads',     name: 'Letterheads',           icon: FileText,   desc: 'Corporate stationery', from: '₹599' },
  { slug: 'wedding-cards',   name: 'Wedding Cards',         icon: Heart,      desc: 'Elegant invitations', from: '₹1,299' },
  { slug: 'photo-printing',  name: 'Photo Printing',        icon: ImageIcon,  desc: 'High-res prints', from: '₹49' },
  { slug: 'merchandise',     name: 'Branded Merchandise',   icon: Shirt,      desc: 'T-shirts, mugs, pens', from: '₹199' },
]

const NAV_LINKS = [
  { href: '/about', label: 'About', icon: Info },
  { href: '/clients', label: 'Clients', icon: Layers },
  { href: '/contact', label: 'Contact', icon: Mail },
  { href: '/track', label: 'Track Order', icon: MapPin },
] as const

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-2.5 group focus-visible:outline-none" aria-label="Jawahar Printing Press — Home">
      <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 bg-gradient-to-br from-brand-blue to-[#1a4fd8] shadow-[0_2px_8px_rgba(45,111,255,0.3)] group-hover:shadow-glow transition-shadow duration-300">
        <Printer size={18} className="text-white" strokeWidth={2.2} />
      </div>
      <div className="leading-none">
        <span className="font-display font-bold text-xl text-text-primary tracking-tight block">JPP</span>
        <span className="text-[10px] text-text-secondary tracking-[0.15em] uppercase font-medium block -mt-0.5">Est. 1972</span>
      </div>
    </Link>
  )
}

// ─── Search Bar ───────────────────────────────────────────────────────────────

function SearchBar() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) ref.current?.focus()
  }, [open])

  return (
    <div className="relative hidden md:flex items-center">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <input
              ref={ref}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') { setOpen(false); setQ('') }
                if (e.key === 'Enter' && q.trim()) window.location.href = `/catalog?q=${encodeURIComponent(q)}`
              }}
              placeholder="Search products…"
              className="w-full h-9 pl-3 pr-8 rounded-md border border-border bg-bg-secondary text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-brand-blue focus:shadow-[0_0_0_3px_rgba(45,111,255,0.1)] transition-all"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => { setOpen((o) => !o); if (open) setQ('') }}
        className="w-9 h-9 flex items-center justify-center rounded-md text-text-secondary hover:text-brand-blue hover:bg-blue-50 transition-colors"
        aria-label="Search"
      >
        {open ? <X size={17} /> : <Search size={17} />}
      </button>
    </div>
  )
}

// ─── Cart Button ──────────────────────────────────────────────────────────────

function CartButton() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true); useCartStore.persist.rehydrate() }, [])
  const totalItems = useCartStore((s) => s.totalItems)
  const count = mounted ? totalItems() : 0

  return (
    <Link href="/order/cart" className="relative flex items-center justify-center w-9 h-9 rounded-md text-text-secondary hover:text-brand-blue hover:bg-blue-50 transition-colors touch-target" aria-label={`Cart — ${count} item${count !== 1 ? 's' : ''}`}>
      <ShoppingCart size={19} strokeWidth={1.9} />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key="cart-count"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-brand-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none"
          >
            {count > 99 ? '99+' : count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )
}

// ─── Mega Menu ────────────────────────────────────────────────────────────────

function MegaMenu({ open }: { open: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18 }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[640px] bg-white rounded-xl border border-border shadow-large p-5 z-50"
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <p className="text-xs font-bold text-text-secondary tracking-widest uppercase">All Products</p>
            <Link href="/catalog" className="flex items-center gap-1 text-xs text-brand-blue font-semibold hover:underline">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {PRODUCT_CATEGORIES.map(({ slug, name, icon: Icon, desc, from }) => (
              <Link
                key={slug}
                href={`/catalog/${slug}`}
                className="group flex flex-col gap-1.5 p-3 rounded-lg hover:bg-bg-secondary transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Icon size={16} className="text-brand-blue" strokeWidth={1.8} />
                </div>
                <span className="text-xs font-semibold text-text-primary leading-tight">{name}</span>
                <span className="text-[11px] text-text-tertiary leading-tight">{desc}</span>
                <span className="text-[11px] font-price font-semibold text-brand-blue">From {from}</span>
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-border flex gap-3">
            <Link href="/order/custom" className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-brand-blue text-white text-sm font-medium hover:bg-[#1a5ce8] transition-colors">
              <Printer size={15} /> Get Custom Quote
            </Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-[#25D366]/10 text-[#25D366] text-sm font-medium border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors">
              WhatsApp Us
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Mobile Menu ──────────────────────────────────────────────────────────────

function MobileMenu({ isOpen, onClose, pathname }: { isOpen: boolean; onClose: () => void; pathname: string }) {
  const [showProducts, setShowProducts] = useState(false)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="mobile-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden" onClick={onClose} aria-hidden="true" />
          <motion.div key="mobile-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-40 w-[min(340px,100vw)] bg-white border-l border-border flex flex-col lg:hidden shadow-large"
            role="dialog" aria-modal="true" aria-label="Navigation menu">

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <Logo onClick={onClose} />
              <button onClick={onClose} className="touch-target text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-md transition-colors" aria-label="Close menu">
                <X size={20} />
              </button>
            </div>

            {/* Search mobile */}
            <div className="px-4 pt-4 pb-2 shrink-0">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search products…"
                  onKeyDown={(e) => {
                    const v = (e.target as HTMLInputElement).value
                    if (e.key === 'Enter' && v.trim()) { window.location.href = `/catalog?q=${encodeURIComponent(v)}`; onClose() }
                  }}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-bg-secondary text-sm placeholder:text-text-tertiary outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto py-2" aria-label="Main navigation">
              <ul className="space-y-0.5 px-3">

                {/* Products accordion */}
                <li>
                  <button
                    onClick={() => setShowProducts((s) => !s)}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-md text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                  >
                    <span className="flex items-center gap-3"><Package size={18} strokeWidth={1.8} /> Products</span>
                    <ChevronDown size={15} className={`transition-transform duration-200 ${showProducts ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showProducts && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="pl-4 pr-2 pb-2 grid grid-cols-2 gap-1">
                          {PRODUCT_CATEGORIES.map(({ slug, name, icon: Icon }) => (
                            <Link key={slug} href={`/catalog/${slug}`} onClick={onClose}
                              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-text-secondary hover:text-brand-blue hover:bg-blue-50 transition-colors">
                              <Icon size={14} strokeWidth={1.8} /> {name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>

                {NAV_LINKS.map(({ href, label, icon: Icon }, i) => {
                  const isActive = pathname.startsWith(href)
                  return (
                    <motion.li key={href} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <Link href={href} onClick={onClose}
                        className={`flex items-center justify-between px-4 py-3 rounded-md text-sm font-medium transition-colors duration-150 ${isActive ? 'bg-blue-50 text-brand-blue' : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'}`}>
                        <span className="flex items-center gap-3"><Icon size={18} strokeWidth={1.8} />{label}</span>
                        <ChevronRight size={14} className="opacity-40" />
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="shrink-0 p-4 border-t border-border space-y-3">
              <a href={`tel:+919999999999`} className="flex items-center justify-center gap-2 w-full h-10 rounded-lg bg-bg-secondary border border-border text-sm font-medium text-text-primary hover:bg-bg-muted transition-colors">
                <Phone size={15} className="text-brand-blue" />
                +91 99999 99999
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={onClose}
                className="flex items-center justify-center gap-2 w-full h-10 rounded-lg text-sm font-medium bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors">
                Chat on WhatsApp
              </a>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={onClose}>
                  <Button variant="secondary" fullWidth size="md"><LogIn size={15} />Login</Button>
                </Link>
                <Link href="/register" onClick={onClose}>
                  <Button variant="primary" fullWidth size="md">Sign Up</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Navbar (main export) ─────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname()
  const scrolled = useScrolled(10)
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore()
  const [megaOpen, setMegaOpen] = useState(false)
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { setMobileMenuOpen(false) }, [pathname, setMobileMenuOpen])

  const openMega  = () => { if (megaTimer.current) clearTimeout(megaTimer.current); setMegaOpen(true) }
  const closeMega = () => { megaTimer.current = setTimeout(() => setMegaOpen(false), 150) }

  return (
    <>
      <header className={`w-full bg-white transition-all duration-300 ${scrolled ? 'shadow-nav' : 'border-b border-transparent'}`}>
        <div className="container-page">
          <div className="flex items-center justify-between h-16">

            {/* Left — Logo */}
            <Logo />

            {/* Center — Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">

              {/* Products mega-menu trigger */}
              <div className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
                <button
                  className={`relative flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${megaOpen ? 'text-brand-blue bg-blue-50' : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'}`}
                  aria-expanded={megaOpen}
                  aria-haspopup="true"
                >
                  Products
                  <ChevronDown size={14} className={`transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`} />
                </button>
                <MegaMenu open={megaOpen} />
              </div>

              {NAV_LINKS.map(({ href, label }) => {
                const isActive = pathname.startsWith(href)
                return (
                  <Link key={href} href={href}
                    className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${isActive ? 'text-brand-blue bg-blue-50' : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'}`}>
                    {label}
                    {isActive && (
                      <motion.span layoutId="nav-underline" className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-brand-blue rounded-full" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right — Actions */}
            <div className="flex items-center gap-1.5">
              {/* Phone */}
              <a href="tel:+919999999999" className="hidden xl:flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors px-2 py-1">
                <Phone size={13} className="text-brand-blue" /> +91 99999 99999
              </a>

              <div className="hidden xl:block w-px h-5 bg-border" />

              <SearchBar />

              <CartButton />

              <Link href="/login" className="hidden sm:block">
                <Button variant="secondary" size="sm" icon={<User size={14} />}>Login</Button>
              </Link>

              <Link href="/order/custom" className="hidden md:block">
                <Button variant="primary" size="sm">Get Quote</Button>
              </Link>

              {/* Hamburger — mobile/tablet */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden touch-target text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-md transition-colors"
                aria-label="Open navigation menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu size={22} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)} pathname={pathname} />
    </>
  )
}
