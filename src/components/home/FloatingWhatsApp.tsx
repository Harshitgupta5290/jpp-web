'use client'

import { motion } from 'framer-motion'
import { Phone, Mail } from 'lucide-react'

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919999999999'
const PHONE     = process.env.NEXT_PUBLIC_PHONE            ?? '+91 99999 99999'
const EMAIL     = process.env.NEXT_PUBLIC_EMAIL            ?? 'info@jawaharprintingpress.com'

const WA_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi! I want to place a printing order.')}`
const TEL    = `tel:${PHONE.replace(/\s/g, '')}`
const MAIL   = `mailto:${EMAIL}`

function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

interface FabProps {
  href: string
  label: string
  tip: string
  delay?: number
  children: React.ReactNode
  className: string
  target?: string
}

function Fab({ href, label, tip, delay = 0, children, className, target }: FabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 22 }}
      className="group flex items-center gap-3"
    >
      {/* Tooltip — appears on hover to the left */}
      <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-xl px-3 py-1.5 shadow-card border border-border text-right">
        <p className="text-xs font-bold text-text-primary whitespace-nowrap">{label}</p>
        <p className="text-[10px] text-text-secondary whitespace-nowrap">{tip}</p>
      </div>

      <motion.a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        aria-label={label}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 ${className}`}
      >
        {children}
      </motion.a>
    </motion.div>
  )
}

export default function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">
      {/* Email */}
      <Fab
        href={MAIL}
        label="Email us"
        tip={EMAIL}
        delay={0.1}
        className="bg-[#F5A500] shadow-[0_4px_18px_rgba(245,165,0,0.4)] hover:shadow-[0_4px_28px_rgba(245,165,0,0.6)] transition-shadow"
      >
        <Mail size={20} strokeWidth={2.2} />
      </Fab>

      {/* Phone */}
      <Fab
        href={TEL}
        label="Call us"
        tip={PHONE}
        delay={0.05}
        className="bg-[#2D6FFF] shadow-[0_4px_18px_rgba(45,111,255,0.4)] hover:shadow-[0_4px_28px_rgba(45,111,255,0.6)] transition-shadow"
      >
        <Phone size={20} strokeWidth={2.2} />
      </Fab>

      {/* WhatsApp — main FAB */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0, type: 'spring', stiffness: 300, damping: 22 }}
        className="relative group flex items-center gap-3"
      >
        <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-xl px-3 py-1.5 shadow-card border border-border text-right">
          <p className="text-xs font-bold text-text-primary whitespace-nowrap">Chat on WhatsApp</p>
          <p className="text-[10px] text-[#25D366] whitespace-nowrap">● Online now</p>
        </div>

        {/* Pulse ring */}
        <span className="absolute right-0 w-14 h-14 rounded-full bg-[#25D366] animate-ping opacity-20" aria-hidden="true" />

        <motion.a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Chat on WhatsApp"
          className="relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center
            shadow-[0_4px_24px_rgba(37,211,102,0.4)] hover:shadow-[0_4px_32px_rgba(37,211,102,0.6)]
            transition-shadow duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
        >
          <WhatsAppIcon size={28} />
        </motion.a>
      </motion.div>
    </div>
  )
}
