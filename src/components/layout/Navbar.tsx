'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart,
  Menu,
  X,
  Phone,
  Package,
  Info,
  Mail,
  MapPin,
  ChevronRight,
  Printer,
  User,
  LogIn,
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { useScrolled } from '@/hooks/useScrolled'
import Button from '@/components/ui/Button'

const NAV_LINKS = [
  { href: '/catalog', label: 'Products', icon: Package },
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: Mail },
  { href: '/track', label: 'Track Order', icon: MapPin },
] as const

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919999999999'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I want to place a printing order.')}`

// ─── JPP Logo ────────────────────────────────────────────────────────────────

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex items-center gap-2.5 group focus-visible:outline-none"
      aria-label="Jawahar Printing Press — Home"
    >
      {/* Icon mark */}
      <div
        className="
          w-9 h-9 rounded-md flex items-center justify-center shrink-0
          bg-gradient-to-br from-brand-blue to-[#1a4fd8]
          shadow-[0_0_0_1px_rgba(45,111,255,0.4),0_4px_12px_rgba(45,111,255,0.25)]
          group-hover:shadow-glow transition-shadow duration-300
        "
      >
        <Printer size={18} className="text-white" strokeWidth={2.2} />
      </div>

      {/* Wordmark */}
      <div className="leading-none">
        <span className="font-display font-bold text-xl text-text-primary tracking-tight block">
          JPP
        </span>
        <span className="text-[10px] text-text-secondary tracking-[0.15em] uppercase font-medium block -mt-0.5">
          Est. 1972
        </span>
      </div>
    </Link>
  )
}

// ─── Cart Button ─────────────────────────────────────────────────────────────

function CartButton() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    // Rehydrate Zustand persist store after mount to avoid SSR mismatch
    useCartStore.persist.rehydrate()
  }, [])
  const totalItems = useCartStore((s) => s.totalItems)
  const count = mounted ? totalItems() : 0

  return (
    <Link
      href="/order/cart"
      className="
        relative flex items-center justify-center
        w-10 h-10 rounded-md
        text-text-secondary hover:text-text-primary hover:bg-white/5
        transition-colors duration-150 touch-target
      "
      aria-label={`Cart — ${count} item${count !== 1 ? 's' : ''}`}
    >
      <ShoppingCart size={20} strokeWidth={1.8} />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key="cart-count"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="
              absolute -top-0.5 -right-0.5
              min-w-[18px] h-[18px] px-1
              bg-brand-blue text-white text-[10px] font-bold
              rounded-full flex items-center justify-center
              leading-none
            "
          >
            {count > 99 ? '99+' : count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )
}

// ─── WhatsApp Button ──────────────────────────────────────────────────────────

function WhatsAppButton({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="
          flex items-center justify-center w-10 h-10 rounded-md
          bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20
          transition-colors duration-150 touch-target
        "
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon size={20} />
      </a>
    )
  }

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="
        hidden lg:flex items-center gap-2
        h-9 px-4 rounded-md text-sm font-medium
        bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20
        hover:bg-[#25D366]/20 hover:border-[#25D366]/40
        transition-all duration-150
      "
    >
      <WhatsAppIcon size={16} />
      <span>WhatsApp</span>
    </a>
  )
}

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

// ─── Mobile Menu ──────────────────────────────────────────────────────────────

function MobileMenu({
  isOpen,
  onClose,
  pathname,
}: {
  isOpen: boolean
  onClose: () => void
  pathname: string
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

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
          {/* Backdrop */}
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            key="mobile-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="
              fixed top-0 right-0 bottom-0 z-40
              w-[min(320px,100vw)]
              bg-bg-secondary border-l border-border
              flex flex-col lg:hidden
              shadow-[-24px_0_80px_rgba(0,0,0,0.5)]
            "
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <Logo onClick={onClose} />
              <button
                onClick={onClose}
                className="touch-target text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-md transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto py-4" aria-label="Main navigation">
              <ul className="space-y-1 px-3">
                {NAV_LINKS.map(({ href, label, icon: Icon }, i) => {
                  const isActive = pathname.startsWith(href)
                  return (
                    <motion.li
                      key={href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <Link
                        href={href}
                        onClick={onClose}
                        className={`
                          flex items-center justify-between
                          px-4 py-3 rounded-md text-sm font-medium
                          transition-colors duration-150
                          ${isActive
                            ? 'bg-brand-blue/10 text-brand-blue'
                            : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                          }
                        `}
                      >
                        <span className="flex items-center gap-3">
                          <Icon size={18} strokeWidth={1.8} />
                          {label}
                        </span>
                        <ChevronRight size={14} className="opacity-40" />
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>
            </nav>

            {/* Drawer footer — CTAs */}
            <div className="shrink-0 p-4 border-t border-border space-y-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="
                  flex items-center justify-center gap-2 w-full
                  h-11 rounded-md text-sm font-medium
                  bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20
                  hover:bg-[#25D366]/20 transition-colors
                "
              >
                <WhatsAppIcon size={18} />
                Chat on WhatsApp
              </a>

              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={onClose}>
                  <Button variant="secondary" fullWidth size="md">
                    <LogIn size={15} />
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={onClose}>
                  <Button variant="primary" fullWidth size="md">
                    Sign Up
                  </Button>
                </Link>
              </div>

              <p className="text-center text-[11px] text-text-secondary pt-1">
                <Phone size={10} className="inline mr-1" />
                Need help? Call{' '}
                <a href="tel:+919999999999" className="text-brand-blue hover:underline">
                  +91 99999 99999
                </a>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Navbar (main export) ────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname()
  const scrolled = useScrolled(20)
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname, setMobileMenuOpen])

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-20
          transition-all duration-300
          ${scrolled
            ? 'bg-bg-primary/80 backdrop-blur-xl border-b border-border shadow-[0_1px_0_rgba(255,255,255,0.04)]'
            : 'bg-transparent'
          }
        `}
      >
        <div className="container-page">
          <div className="flex items-center justify-between h-16">

            {/* Left — Logo */}
            <Logo />

            {/* Center — Desktop nav */}
            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`
                      relative px-4 py-2 text-sm font-medium rounded-md
                      transition-colors duration-150
                      ${isActive
                        ? 'text-text-primary'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                      }
                    `}
                  >
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-3 right-3 h-[2px] bg-brand-blue rounded-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right — Actions */}
            <div className="flex items-center gap-2">
              <WhatsAppButton />

              <CartButton />

              {/* Login — desktop only */}
              <Link href="/login" className="hidden sm:block">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<User size={14} />}
                >
                  Login
                </Button>
              </Link>

              {/* Get Quote CTA — desktop only */}
              <Link href="/order/custom" className="hidden md:block">
                <Button variant="primary" size="sm">
                  Get Quote
                </Button>
              </Link>

              {/* Hamburger — mobile/tablet */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="
                  lg:hidden touch-target
                  text-text-secondary hover:text-text-primary
                  hover:bg-white/5 rounded-md transition-colors
                "
                aria-label="Open navigation menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <Menu size={22} strokeWidth={1.8} />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile drawer — rendered outside the fixed header to avoid stacking context issues */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        pathname={pathname}
      />
    </>
  )
}
